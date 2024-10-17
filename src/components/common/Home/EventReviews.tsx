import React, { useEffect, useState } from 'react';
import { EventData, Posts } from '@/types';
import { fetchPostsByEventId } from '@/api/post';
import { PostCard } from '@/components/post/PostCard';
import { SkeletonPostCard } from '@/components/post/UI/SkeletonPostCard';

interface EventReviewsProps {
  eventId: string;
  event?: EventData;
}

const EventReviews: React.FC<EventReviewsProps> = ({ eventId }) => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await fetchPostsByEventId(eventId);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [eventId]);

  if (loading) {
    return (
      <div>
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <SkeletonPostCard key={index} />
          ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p>아직 후기가 없습니다.</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default EventReviews;
