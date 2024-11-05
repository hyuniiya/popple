import React, { useEffect, useState, useCallback } from 'react';
import { fetchEvents } from '@/api/info';
import { EventData } from '@/types';

interface EventMarkersProps {
  map: any;
}

interface EventWithCoordinates extends EventData {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const EventMarkers: React.FC<EventMarkersProps> = ({ map }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isNaverLoaded, setIsNaverLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkNaverLoaded = useCallback(() => {
    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      setIsNaverLoaded(true);
    } else {
      setTimeout(checkNaverLoaded, 100);
    }
  }, []);

  useEffect(() => {
    checkNaverLoaded();
  }, [checkNaverLoaded]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isNaverLoaded) {
      getEvents();
    }
  }, [isNaverLoaded]);

  useEffect(() => {
    if (!map || events.length === 0 || !isNaverLoaded || isLoading) return;

    const addMarkersToMap = async () => {
      for (const event of events) {
        if (
          event.location &&
          typeof event.location === 'object' &&
          'latitude' in event.location &&
          'longitude' in event.location
        ) {
          const { latitude, longitude } = event.location;
          addMarker({
            ...event,
            coordinates: {
              latitude: Number(latitude),
              longitude: Number(longitude),
            },
          });
        } else if (typeof event.location === 'string') {
          try {
            const { lat, lng } = await geocodeLocation(event.location);
            if (lat && lng) {
              addMarker({
                ...event,
                coordinates: { latitude: lat, longitude: lng },
              });
            } else {
              console.warn('Failed to geocode location for event:', event.name);
            }
          } catch (error) {
            console.error('Error geocoding location:', error);
          }
        } else {
          console.warn('Event missing location data:', event);
        }
      }
    };

    addMarkersToMap();
  }, [events, map, isNaverLoaded, isLoading]);

  const geocodeLocation = (
    address: string,
  ): Promise<{ lat: number | null; lng: number | null }> => {
    return new Promise(resolve => {
      if (!isNaverLoaded) {
        console.error('Naver Maps API not loaded');
        resolve({ lat: null, lng: null });
        return;
      }

      window.naver.maps.Service.geocode(
        { query: address },
        (
          status: any,
          response: { v2: { meta: { totalCount: number }; addresses: any[] } },
        ) => {
          if (status === window.naver.maps.Service.Status.ERROR) {
            console.error('Geocoding failed:', address);
            resolve({ lat: null, lng: null });
            return;
          }

          if (response.v2.meta.totalCount > 0) {
            const item = response.v2.addresses[0];
            const lat = parseFloat(item.y);
            const lng = parseFloat(item.x);
            resolve({ lat, lng });
          } else {
            console.warn('No results found for address:', address);
            resolve({ lat: null, lng: null });
          }
        },
      );
    });
  };

  const addMarker = (event: EventWithCoordinates) => {
    const { latitude, longitude } = event.coordinates;

    if (isNaN(latitude) || isNaN(longitude)) {
      return;
    }

    const eventLocation = new window.naver.maps.LatLng(latitude, longitude);

    const markerIcon = {
      url: '/public/logo_img.png',
      size: new window.naver.maps.Size(100, 100),
      origin: new window.naver.maps.Point(0, 0),
      anchor: new window.naver.maps.Point(25, 50),
    };

    const marker = new window.naver.maps.Marker({
      position: eventLocation,
      map: map,
      icon: markerIcon,
    });

    new window.naver.maps.Marker({
      position: eventLocation,
      map: map,
      icon: {
        content: `<div style="
          padding: 5px;
          background-color: transparent;
          color: rgb(106, 90, 205);
          font-family: 'GodoB', sans-serif;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
          white-space: nowrap;
        ">${event.name}</div>`,
        anchor: new window.naver.maps.Point(50, -10),
      },
      zIndex: marker.getZIndex() - 1,
    });
  };

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>{error}</div>;

  return null;
};

export default EventMarkers;
