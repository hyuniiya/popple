import React, { useEffect, useState } from 'react';
import { Posts } from '@/types';
import { Link } from 'react-router-dom';
import useEvents from '@/hooks/useEvents';
import { getLikesCount } from '@/api/post';
import { formatDate } from '@/lib/utils';
import { FaHeart } from 'react-icons/fa';
import { SkeletonPostCard } from './UI/SkeletonPostCard';

interface PostCardProps {
  post: Posts;
}

const getRegionDisplay = (location: string) => {
  const parts = location.split(' ');
  if (parts[0] === '서울특별시' || parts[0] === '서울시') {
    return `[${parts[1].replace('구', '')}]`;
  } else {
    return `[${parts[0].slice(0, 2)}]`;
  }
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { events, loading } = useEvents();
  const event = events.find(e => e.id === post.eventId);
  const [likesCount, setLikesCount] = useState<number | null>(null);

  useEffect(() => {
    getLikesCount(post.id).then(setLikesCount);
  }, [post.id]);

  const regionDisplay = event ? getRegionDisplay(event.location) : '[지역]';

  if (loading) {
    return <SkeletonPostCard />;
  }

  return (
    <Link to={`/posts/${post.id}`}>
      <div className="flex h-40 border border-popover-foreground rounded-lg items-center justify-center p-4">
        <img
          src={event?.imageUrl || post.imageUrls?.[0]}
          alt={event?.name || post.title}
          className="w-[120px] h-[120px] rounded-sm object-cover"
        />
        <div className="ml-4 flex-1">
          <span
            className={`inline-block px-4 py-0.5 text-[12px] font-godob rounded-full ${
              event?.status === 'ongoing'
                ? 'bg-proceeding text-white'
                : 'bg-secondary text-white'
            }`}
          >
            {event?.status === 'ongoing' ? '진행 중' : '종료'}
          </span>
          <h3 className="mt-2 text-[12px] font-semibold text-gray-800">
            {regionDisplay}{' '}
            {event?.name.replace('팝업스토어', '') || post.exhibitionImage}
          </h3>
          <h4 className="mt-1 text-[11px] text-gray-600">{post.title}</h4>
          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
            {post.content}
          </p>
          <div className="mt-2 flex items-center text-[12px] text-gray-500">
            <span>{formatDate(post.createdAt)} | </span>
            <span className="flex items-center">
              <FaHeart className="text-secondary-foreground mx-1" />{' '}
              {likesCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
