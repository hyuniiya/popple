import React from 'react';
import { useBookmark } from '@/hooks/useBookmark';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface BookmarkButtonProps {
  userId: string;
  eventId: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ userId, eventId }) => {
  const { isBookmarked, isLoading, toggleBookmark } = useBookmark(
    userId,
    eventId,
  );

  return (
    <button
      onClick={toggleBookmark}
      disabled={isLoading}
      className={`p-2 rounded-full ${isBookmarked ? 'bg-white' : 'bg-white'}`}
    >
      {isLoading ? (
        ''
      ) : isBookmarked ? (
        <FaHeart className="text-primary" />
      ) : (
        <FaRegHeart className="text-primary" />
      )}
    </button>
  );
};

export default BookmarkButton;
