import React from 'react';
import { Posts } from '@/types';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Posts;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link to={`/posts/${post.id}`}>
      <div className="flex h-40 border border-popover-foreground rounded-lg items-center justify-center">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-[120px] h-[120px] rounded-sm object-cover"
        />
        <div className="p-4 flex-1">
          <span
            className={`inline-block px-4 py-0.5 text-xs font-godob rounded-full ${
              post.isOngoing
                ? 'bg-proceeding text-white'
                : 'bg-secondary text-white'
            }`}
          >
            {post.isOngoing ? '진행 중' : '종료'}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-gray-800">
            [{post.region}] {post.exhibitionImage}
          </h3>
          <h4 className="mt-1 text-md text-gray-600">{post.title}</h4>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {post.content}
          </p>
          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>좋아요 {post.likes}</span>
            <span>{post.authorNickname}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
