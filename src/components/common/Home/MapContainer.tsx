import React, { useEffect, useRef, useState } from 'react';

interface MapContainerProps {
  children: (map: any) => React.ReactNode;
}

declare global {
  interface Window {
    naver: any;
  }
}

const SkeletonLoader = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="animate-pulse">
      <div className="h-64 w-full bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

const MapContainer: React.FC<MapContainerProps> = ({ children }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAPS_CLIENT_ID}`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = initializeMap;
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.naver) return;

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const currentLocation = new window.naver.maps.LatLng(
            latitude,
            longitude,
          );

          const newMap = new window.naver.maps.Map(mapRef.current, {
            center: currentLocation,
            zoom: 13,
          });

          new window.naver.maps.Marker({
            position: currentLocation,
            map: newMap,
            icon: {
              content:
                '<div style="background-color:#1E90FF;width:15px;height:15px;border-radius:50%;border:2px solid white;"></div>',
              anchor: new window.naver.maps.Point(7.5, 7.5),
            },
          });

          setMap(newMap);
          setIsLoading(false);
        },
        error => {
          console.error('Error getting current location:', error);
          const defaultLocation = new window.naver.maps.LatLng(
            37.5665,
            126.978,
          );
          const newMap = new window.naver.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 13,
          });
          setMap(newMap);
          setIsLoading(false);
        },
      );
    };

    loadMapScript();

    return () => {
      const script = document.querySelector(
        'script[src^="https://openapi.map.naver.com"]',
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full">
      {isLoading ? <SkeletonLoader /> : map && children(map)}
    </div>
  );
};

export default MapContainer;
