import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { fetchPosts } from '@/api/post';
import { Posts } from '@/types';
import React from 'react';
import { PostCard } from './PostCard';
import { SkeletonPostCard } from './UI/SkeletonPostCard';

export const PostList: React.FC = () => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery('posts', ({ pageParam }) => fetchPosts(pageParam), {
      getNextPageParam: lastPage => {
        return lastPage.lastVisible || undefined;
      },
    });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading && !data) {
    return (
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
          {[...Array(5)].map((_, i) => (
            <SkeletonPostCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-red-500">Error loading posts</div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.posts.map((post: Posts) => (
              <PostCard key={post.id} post={post} />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={ref} className="text-center py-4">
        {isLoading ? (
          <SkeletonPostCard />
        ) : hasNextPage ? (
          ''
        ) : data?.pages.length ? (
          ''
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
