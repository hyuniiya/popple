import React, { useState, useRef, useCallback } from 'react';
import { PostCard } from '@/components/post/PostCard';
import { useUserPosts } from '@/hooks/useUserPosts';
import { SkeletonPostCard } from '@/components/post/UI/SkeletonPostCard';

const MyPostList: React.FC = () => {
  const [sortBy, setSortBy] = useState<'latest' | 'comments'>('latest');
  const [searchTerm] = useState('');
  const { posts, loading, error, loadMore } = useUserPosts();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && posts.length >= 3) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, posts.length, loadMore],
  );

  const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as 'latest' | 'comments');
  };

  const filteredPosts = posts.filter(
    post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-godob text-primary">내가 쓴 글</h1>
        <div className="flex items-center">
          <select
            value={sortBy}
            onChange={handleSort}
            className="text-[12px] font-semibold border p-2 text-card-foreground rounded"
          >
            <option value="latest">최신순</option>
            <option value="comments">댓글순</option>
          </select>
        </div>
      </div>
      {error && <p>에러 발생: {error}</p>}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <div
            key={`${post.id}-${index}`}
            className="mb-6"
            ref={index === filteredPosts.length - 1 ? lastPostElementRef : null}
          >
            <PostCard post={post} />
          </div>
        ))}
        {loading && (
          <>
            <SkeletonPostCard />
            <SkeletonPostCard />
            <SkeletonPostCard />
          </>
        )}
      </div>
    </div>
  );
};

export default MyPostList;
