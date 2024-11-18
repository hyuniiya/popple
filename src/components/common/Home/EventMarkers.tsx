import React, { useEffect, useState, useCallback } from 'react';
import { fetchEvents } from '@/api/info';
import { EventData } from '@/types';

interface EventMarkersProps {
  map: any;
}

interface EventWithCoordinates extends EventData {
  date: any;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const EventMarkers: React.FC<EventMarkersProps> = ({ map }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<EventWithCoordinates | null>(null);
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
            date: undefined,
          });
        } else if (typeof event.location === 'string') {
          try {
            const { lat, lng } = await geocodeLocation(event.location);
            if (lat && lng) {
              addMarker({
                ...event,
                coordinates: { latitude: lat, longitude: lng },
                date: undefined,
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
      url: '/logo_img.png',
      size: new window.naver.maps.Size(100, 100),
      origin: new window.naver.maps.Point(0, 0),
      anchor: new window.naver.maps.Point(25, 50),
    };

    const marker = new window.naver.maps.Marker({
      position: eventLocation,
      map: map,
      icon: markerIcon,
    });

    const nameMarker = new window.naver.maps.Marker({
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

    // Add click event to both markers
    window.naver.maps.Event.addListener(marker, 'click', () => {
      setSelectedEvent(event);
    });

    window.naver.maps.Event.addListener(nameMarker, 'click', () => {
      setSelectedEvent(event);
    });
  };

  // Render event details card when an event is selected
  const renderEventDetails = () => {
    if (!selectedEvent) return null;

    return (
      <div
        className="fixed bottom-28 left-1/2 transform -translate-x-1/2 
        bg-white shadow-lg rounded-lg p-4 max-w-md w-full 
        border border-gray-200 z-50"
        style={{ maxHeight: '150px', overflowY: 'auto' }}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-primary">
            {selectedEvent.name}
          </h2>
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {/* {selectedEvent.description && (
          <p className="text-gray-600 mb-2">{selectedEvent.description}</p>
        )} */}
        {selectedEvent.location && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {typeof selectedEvent.location === 'object'
              ? `${selectedEvent.location}`
              : `${selectedEvent.location}`}
          </div>
        )}
        {selectedEvent.date && (
          <div className="flex items-center text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {selectedEvent.date}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>{error}</div>;

  return <>{renderEventDetails()}</>;
};

export default EventMarkers;
