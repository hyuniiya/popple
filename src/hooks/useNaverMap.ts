import { useState, useEffect } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}

export const useNaverMap = (location: string) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_NAVER_MAPS_CLIENT_ID;

    const loadNaverMaps = () => {
      if (window.naver && window.naver.maps) {
        setIsLoaded(true);
      } else {
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
        script.async = true;
        script.onload = () => {
          if (window.naver && window.naver.maps) {
            setIsLoaded(true);
          }
        };
        document.head.appendChild(script);
      }
    };

    loadNaverMaps();

    return () => {
      const script = document.querySelector(
        'script[src^="https://openapi.map.naver.com"]',
      );
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && location) {
      getCoordinates(location);
    }
  }, [isLoaded, location]);

  const getCoordinates = (address: string) => {
    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      window.naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status: any, response: any) {
          if (status === window.naver.maps.Service.Status.ERROR) {
            console.error('Geocoding error');
            return;
          }
          if (response.v2.meta.totalCount === 0) {
            console.error('No results found');
            return;
          }
          const item = response.v2.addresses[0];
          const point = new window.naver.maps.Point(item.x, item.y);
          setCoordinates({ lat: point.y, lng: point.x });
        },
      );
    } else {
      console.error('Naver maps API is not loaded');
    }
  };

  return coordinates;
};
