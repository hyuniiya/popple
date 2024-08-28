import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/api/firebase';

export const useGetBookmark = (userId: string) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const q = query(
          collection(db, 'bookmarks'),
          where('userId', '==', userId),
        );
        const querySnapshot = await getDocs(q);
        const bookmarkIds = querySnapshot.docs.map(doc => doc.data().eventId);
        setBookmarks(bookmarkIds);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  return { bookmarks, loading, error };
};
