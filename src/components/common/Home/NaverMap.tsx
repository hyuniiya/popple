import React, { useEffect, useRef } from 'react';

interface NaverMapProps {
  coordinates: { lat: number; lng: number } | null;
  eventName: string;
  eventType: 'popup' | 'exhibition';
}

const NaverMap: React.FC<NaverMapProps> = ({
  coordinates,
  eventName,
  eventType,
}) => {
  const mapElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!coordinates || !mapElement.current) return;

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAPS_CLIENT_ID}`;
    script.async = true;

    const onLoad = () => {
      if (!window.naver || !window.naver.maps) return;

      const location = new window.naver.maps.LatLng(
        coordinates.lat,
        coordinates.lng,
      );
      const mapOptions = {
        center: location,
        zoom: 14,
        minZoom: 10,
        maxZoom: 19,
      };
      const map = new window.naver.maps.Map(mapElement.current, mapOptions);

      const markerIcon = {
        url: '/src/assets/images/logo_img.png',
        size: new window.naver.maps.Size(100, 100),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(25, 50),
      };

      const marker = new window.naver.maps.Marker({
        position: location,
        map: map,
        icon: markerIcon,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="
            font-family: 'GodoB', sans-serif;
            padding: 5px;
            color: rgb(106, 90, 205);
            font-size: 12px;
            text-align: center;
            white-space: nowrap;
          ">
            ${eventName}
          </div>
        `,
        backgroundColor: 'transparent',
        borderWidth: 0,
        disableAnchor: true,
        pixelOffset: new window.naver.maps.Point(0, 80),
      });

      infoWindow.open(map, marker);

      // 지도 중심을 항상 마커 위치로 설정
      map.setCenter(location);
    };

    script.addEventListener('load', onLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', onLoad);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (mapElement.current) {
        mapElement.current.innerHTML = '';
      }
    };
  }, [coordinates, eventName, eventType]);

  return <div ref={mapElement} style={{ width: '100%', height: '400px' }} />;
};

export default NaverMap;