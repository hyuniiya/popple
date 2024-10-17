import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventData } from '@/types';
import { useBookmark } from '@/hooks/useBookmark';
import { useAuth } from '@/context/AuthContext';
import { FaHeart } from 'react-icons/fa';

interface BookmarkCardProps {
  event: EventData;
  onRemove: (eventId: string) => void;
  isLoading?: boolean;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  event,
  onRemove,
  isLoading = false,
}) => {
  const { user } = useAuth();
  const {
    isBookmarked,
    isLoading: bookmarkLoading,
    toggleBookmark,
  } = useBookmark(user?.uid || '', event.id);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isEventOngoing = () => {
    const today = new Date();
    const endDate = new Date(event.endDate);
    return today <= endDate;
  };

  const getEventName = () => {
    if (event.type === 'popup') {
      return event.name.replace('팝업스토어', '').trim();
    }
    return event.name;
  };

  const handleToggleBookmark = async () => {
    const wasBookmarked = isBookmarked;
    await toggleBookmark();
    if (wasBookmarked) {
      onRemove(event.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex border rounded-lg overflow-hidden shadow-lg animate-pulse">
        <div className="w-1/3 h-48 bg-gray-300"></div>
        <div className="w-2/3 p-4 flex flex-col justify-between relative">
          <div>
            <div className="h-4 bg-gray-300 w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/3"></div>
          </div>
          <div className="h-8 bg-gray-300 w-1/3 mt-2"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex border rounded-lg overflow-hidden shadow-lg">
      <div className="w-1/3 h-48 bg-gray-200 relative overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="w-2/3 p-4 flex flex-col justify-between relative">
        <div>
          <span
            className={`inline-block px-4 py-0.5 text-[12px] font-godob rounded-full ${
              isEventOngoing()
                ? 'bg-proceeding text-white'
                : 'bg-secondary text-white'
            }`}
          >
            {isEventOngoing() ? '진행중' : '종료'}
          </span>
          <h3 className="font-bold text-lg mt-1">{getEventName()}</h3>
          <p className="text-gray-600 text-xs mt-1">
            {event.startDate} - {event.endDate}
          </p>
        </div>
        <Link
          to={`/events/${event.id}`}
          className="mt-2 w-24 inline-flex items-center justify-center bg-[rgba(245,245,246,1)] text-[rgba(159,159,159,1)] px-4 py-2 rounded-full text-sm font-semibold shadow-drop"
        >
          상세보기
        </Link>
        <button
          onClick={handleToggleBookmark}
          disabled={bookmarkLoading}
          className="absolute top-1/2 -translate-y-1/2 right-2 text-2xl flex items-center justify-center w-8 h-8"
        >
          {bookmarkLoading ? (
            ''
          ) : isBookmarked ? (
            <FaHeart className="text-secondary-foreground" />
          ) : (
            '🤍'
          )}
        </button>
      </div>
    </div>
  );
};

export default BookmarkCard;
