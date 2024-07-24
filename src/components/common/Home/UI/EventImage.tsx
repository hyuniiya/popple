import React from 'react';

interface EventImageProps {
  imageUrl?: string;
  name: string;
}

const EventImage: React.FC<EventImageProps> = ({ imageUrl, name }) => (
  <div className="w-96 h-72 bg-gray-200 overflow-hidden rounded-lg">
    <img
      src={imageUrl}
      alt={name}
      className="w-full h-full object-container transition-opacity duration-300 ease-in-out"
      style={{ opacity: 0 }}
      onLoad={e => {
        const img = e.target as HTMLImageElement;
        img.style.opacity = '1';
      }}
      onError={e => {
        const img = e.target as HTMLImageElement;
        img.src = '/src/assets/images/logo_y.png';
      }}
    />
  </div>
);

export default EventImage;
