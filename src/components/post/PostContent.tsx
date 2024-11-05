import React, { useState, useEffect } from 'react';
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
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    if (Array.isArray(post.imageUrls)) {
      setImagesLoaded(new Array(post.imageUrls.length).fill(false));
    } else if (post.imageUrl) {
      setImagesLoaded([false]);
    }
  }, [post.imageUrls, post.imageUrl]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">{post.title}</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={author.profileImgUrl || '/user_img.png'}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
        {Array.isArray(post.imageUrls) ? (
          post.imageUrls.map((url, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative"
            >
              {!imagesLoaded[index] && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300" />
              )}
              <img
                src={url}
                alt={`Post image ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  imagesLoaded[index] ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          ))
        ) : post.imageUrl ? (
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
            {!imagesLoaded[0] && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300" />
            )}
            <img
              src={post.imageUrl}
              alt="Post image"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                imagesLoaded[0] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(0)}
            />
          </div>
        ) : null}
      </div>
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
