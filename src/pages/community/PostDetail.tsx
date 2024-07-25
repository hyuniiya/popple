import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchPostById } from '@/api/post';
import { getAllUsers } from '@/api/user';
import { Posts, UserData } from '@/types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useLikePost } from '@/hooks/useLikePost';
import { getLikesCount, isLikedByUser } from '@/api/post';
import { useComments } from '@/hooks/useComments';
import PostContent from '@/components/post/PostContent';
import Comment from '@/components/post/comment/Comment';
import CommentForm from '@/components/forms/CommentForm';
import { formatDate } from '@/lib/utils';
import LoginModal from '@/components/common/modal/LoginModal';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const deletePostMutation = useDeletePost();
  const likePostMutation = useLikePost(id ?? '');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { data: post, isLoading: postLoading } = useQuery<Posts, Error>(
    ['post', id],
    () => fetchPostById(id as string),
    { enabled: !!id },
  );

  const { data: users, isLoading: usersLoading } = useQuery<UserData[], Error>(
    'users',
    getAllUsers,
  );

  const { data: likesCount = 0 } = useQuery(
    ['likes', id],
    () => (id ? getLikesCount(id) : Promise.resolve(0)),
    { enabled: !!id },
  );

  const { data: isLiked = false } = useQuery(
    ['isLiked', id, user?.uid],
    () =>
      id && user?.uid ? isLikedByUser(id, user.uid) : Promise.resolve(false),
    { enabled: !!id && !!user },
  );

  const {
    showComments,
    setShowComments,
    commentText,
    setCommentText,
    commentsData,
    handleCommentSubmit,
    ref,
    hasNextPage,
    commentsCount,
    handleCommentUpdate,
    handleCommentDelete,
  } = useComments(id as string);

  if (postLoading || usersLoading)
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-[0.5px] bg-gray-200"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {[...Array(1)].map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 rounded-lg"
            ></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  if (!post || !users) return <div>Post or Users not found</div>;

  const author = users.find(user => user.uid === post.userId);

  const handleLike = () => {
    if (user) {
      likePostMutation.mutate(user.uid);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  if (!author) return <div>Author not found</div>;

  const isAuthor = user && user.uid === post.userId;

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(id as string);
    }
  };

  const handleCommentFormClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    navigate('/signin');
  };

  const handleLoginRequired = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 pt-8">
      <PostContent
        post={post}
        author={author}
        isAuthor={isAuthor ?? false}
        isLiked={isLiked}
        likesCount={likesCount}
        commentsCount={commentsCount}
        formatDate={formatDate}
        handleLike={handleLike}
        handleDelete={handleDelete}
      />
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center text-popover hover:text-primary transition-colors duration-200 pb-4"
      >
        {showComments ? (
          <>
            댓글창 접기
            <FaChevronUp className="ml-1" />
          </>
        ) : (
          <>
            댓글 쓰기
            <FaChevronDown className="ml-1 " />
          </>
        )}
      </button>
      {showComments && (
        <div>
          {user ? (
            <CommentForm
              user={user}
              commentText={commentText}
              setCommentText={setCommentText}
              handleCommentSubmit={handleCommentSubmit}
            />
          ) : (
            <div
              onClick={handleCommentFormClick}
              className="cursor-pointer p-4 border rounded-lg text-center text-gray-500 hover:bg-gray-100"
            >
              댓글을 작성하려면 로그인이 필요합니다.
            </div>
          )}

          {commentsData?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.comments.map(comment => {
                const commentAuthor = users.find(
                  user => user.uid === comment.userId,
                );
                return (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    user={user}
                    commentAuthor={commentAuthor}
                    formatDate={formatDate}
                    handleCommentUpdate={handleCommentUpdate}
                    handleCommentDelete={handleCommentDelete}
                    isPostAuthor={user?.uid === post.userId}
                    onLoginRequired={handleLoginRequired}
                  />
                );
              })}
            </React.Fragment>
          ))}
          {hasNextPage && (
            <div ref={ref} className="mt-4 text-center">
              ''
            </div>
          )}
        </div>
      )}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onConfirm={handleLoginConfirm}
      />
    </div>
  );
};

export default PostDetail;
