import React from 'react';
import BookmarkButton from './BookmarkButton';

interface EventImageProps {
  imageUrl?: string;
  name: string;
  userId?: string;
  eventId: string;
  showBookmark: boolean;
}

const EventImage: React.FC<EventImageProps> = ({
  imageUrl,
  name,
  userId,
  eventId,
  showBookmark,
}) => (
  <div className="relative w-96 h-72 bg-gray-200 overflow-hidden rounded-lg">
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
    {showBookmark && userId && (
      <div className="absolute bottom-2 right-2">
        <BookmarkButton userId={userId} eventId={eventId} />
      </div>
    )}
  </div>
);

export default EventImage;
