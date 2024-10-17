import React from 'react';
import MapContainer from '@/components/common/Home/\bMapContainer';
import EventMarkers from '@/components/common/Home/EventMarkers';

const Map: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen mb-4">
      <MapContainer>{(map: any) => <EventMarkers map={map} />}</MapContainer>
    </div>
  );
};

export default Map;
