import React from 'react';
import MapContainer from '@/components/common/Home/\bMapContainer';
import EventMarkers from '@/components/common/Home/EventMarkers';

const Map: React.FC = () => {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)] max-w-7xl mx-auto px-4 py-4">
      <div className="w-full h-full">
        <MapContainer>{(map: any) => <EventMarkers map={map} />}</MapContainer>
      </div>
    </div>
  );
};

export default Map;
