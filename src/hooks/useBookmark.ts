import { useState, useEffect } from 'react';
import { addBookmark, removeBookmark, checkIsBookmarked } from '@/api/bookmark';

export const useBookmark = (userId: string, eventId: string) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (userId && eventId) {
        setIsLoading(true);
        const status = await checkIsBookmarked(userId, eventId);
        setIsBookmarked(status);
        setIsLoading(false);
      }
    };
    checkBookmarkStatus();
  }, [userId, eventId]);

  const toggleBookmark = async () => {
    if (userId && eventId) {
      setIsLoading(true);
      try {
        if (isBookmarked) {
          await removeBookmark(userId, eventId);
        } else {
          await addBookmark(userId, eventId);
        }
        setIsBookmarked(!isBookmarked);
      } catch (error) {
        console.error('Error toggling bookmark:', error);
      }
      setIsLoading(false);
    }
  };

  return { isBookmarked, isLoading, toggleBookmark };
};
