import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventData } from '@/types';

interface EventCardProps {
  event: EventData;
  loading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, loading = false }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    if (!loading) {
      navigate(`/events/${event.id}`);
    }
  };

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.style.opacity = '1';
    setImageLoaded(true);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-full h-48 bg-gray-200 relative">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: 0 }}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
