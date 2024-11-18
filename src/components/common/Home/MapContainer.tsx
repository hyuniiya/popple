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
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [marker, setMarker] = useState<any>(null);

  const updateZoomLevel = () => {
    if (!map || !mapRef.current) return;

    const width = mapRef.current.offsetWidth;
    const zoomLevel = width < 600 ? 12 : width < 1024 ? 13 : 14; // 예시: 화면 크기별로 줌 레벨 조정

    map.setZoom(zoomLevel);
  };

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
          setCurrentLocation({ latitude, longitude });

          const currentLocation = new window.naver.maps.LatLng(
            latitude,
            longitude,
          );

          const newMap = new window.naver.maps.Map(mapRef.current, {
            center: currentLocation,
            zoom: 13,
          });

          const newMarker = new window.naver.maps.Marker({
            position: currentLocation,
            map: newMap,
            icon: {
              content:
                '<div style="background-color:#1E90FF;width:15px;height:15px;border-radius:50%;border:2px solid white;"></div>',
              anchor: new window.naver.maps.Point(7.5, 7.5),
            },
          });

          setMap(newMap);
          setMarker(newMarker);
          setIsLoading(false);
          updateZoomLevel();
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
          updateZoomLevel();
        },
      );
    };

    loadMapScript();

    window.addEventListener('resize', updateZoomLevel);

    return () => {
      const script = document.querySelector(
        'script[src^="https://openapi.map.naver.com"]',
      );
      if (script) {
        document.head.removeChild(script);
      }
      window.removeEventListener('resize', updateZoomLevel);
    };
  }, []);

  useEffect(() => {
    if (!map || !currentLocation) return;

    if (currentLocation) {
      const { latitude, longitude } = currentLocation;
      const fixedLocation = new window.naver.maps.LatLng(latitude, longitude);
      map.setCenter(fixedLocation);
    }
  }, [map, currentLocation]);

  const moveToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newLocation = new window.naver.maps.LatLng(latitude, longitude);
        setCurrentLocation({ latitude, longitude });

        map.setCenter(newLocation);

        if (marker) {
          marker.setPosition(newLocation);
        } else {
          const newMarker = new window.naver.maps.Marker({
            position: newLocation,
            map: map,
            icon: {
              content:
                '<div style="background-color:#1E90FF;width:15px;height:15px;border-radius:50%;border:2px solid white;"></div>',
              anchor: new window.naver.maps.Point(7.5, 7.5),
            },
          });
          setMarker(newMarker);
        }
      },
      error => {
        console.error('Error getting current location:', error);
        alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인하세요.');
      },
    );
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full">
        {isLoading ? <SkeletonLoader /> : map && children(map)}
      </div>
      <button
        onClick={moveToCurrentLocation}
        className="fixed top-1/4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-primary text-white font-godob rounded-md shadow-md z-10"
      >
        현 위치에서 검색
      </button>
    </div>
  );
};

export default MapContainer;
