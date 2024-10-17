import { useState, useEffect } from 'react';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { fetchUserPosts } from '@/api/post';
import { Posts } from '@/types';

export const useUserPosts = () => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot | undefined
  >(undefined);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPosts();
    } else {
      setLoading(false);
      setError('');
    }
  }, [user]);

  const loadPosts = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserPosts(user.uid, lastVisible);
      setPosts(prevPosts => {
        const newPosts = [...prevPosts, ...result.posts];
        const uniquePosts = Array.from(new Set(newPosts.map(post => post?.id)))
          .map(id => newPosts.find(post => post?.id === id))
          .filter(
            (post): post is Posts =>
              post !== undefined && post.id !== undefined,
          );
        return uniquePosts;
      });
      setLastVisible(result.lastVisible);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && lastVisible) {
      loadPosts();
    }
  };

  return { posts, loading, error, loadMore };
};
