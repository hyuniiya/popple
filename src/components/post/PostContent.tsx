import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa6';
import { Posts, UserData } from '@/types';

const PostContent: React.FC<{
  post: Posts;
  author: UserData;
  isAuthor: boolean;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  formatDate: (date: any) => string;
  handleLike: () => void;
  handleDelete: () => void;
}> = ({
  post,
  author,
  isAuthor,
  isLiked,
  likesCount,
  commentsCount,
  formatDate,
  handleLike,
  handleDelete,
}) => {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">{post.title}</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={author.profileImgUrl}
            alt={`${author.nickname}'s profile`}
            className="w-10 h-10 rounded-full mr-3 shadow-drop"
          />
          <div className="flex flex-col">
            <span className="text-xs mr-3">{author.nickname}</span>
            <span className="text-[10px] text-popover">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-popover text-xs mb-2">
            <FaRegComment />
            <span>{commentsCount}</span>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/edit/${post.id}`}
                className="text-popover px-2 py-1 rounded text-xs"
              >
                수정
              </Link>
              <div className="mt-0.5 h-5 w-[0.5px] bg-popover"></div>
              <button
                className="text-popover px-2 py-1 rounded text-xs"
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[0.5px] bg-border my-4"></div>
      {Array.isArray(post.imageUrls) ? (
        post.imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Post image ${index + 1}`}
            className="mb-4"
          />
        ))
      ) : post.imageUrl ? (
        <img src={post.imageUrl} alt="Post image" className="mb-4" />
      ) : null}
      <p className="mb-4">{post.content}</p>
      <button
        onClick={handleLike}
        className="flex items-center mr-2 text-secondary-foreground"
      >
        {isLiked ? <FaHeart /> : <FaRegHeart />}
        <span className="ml-1">{likesCount}</span>
      </button>
      <div className="w-full h-[0.5px] bg-border my-4"></div>
    </>
  );
};

export default PostContent;
