import React from 'react';
import { useParams } from 'react-router-dom';
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

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const deletePostMutation = useDeletePost();
  const likePostMutation = useLikePost(id ?? '');

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

  if (postLoading || usersLoading) return <div>Loading...</div>;
  if (!post || !users) return <div>Post or Users not found</div>;

  const author = users.find(user => user.uid === post.userId);

  const handleLike = () => {
    if (user) {
      likePostMutation.mutate(user.uid);
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  if (!author) return <div>Author not found</div>;

  const formatDate = (date: any) => {
    if (!date) return 'Invalid Date';
    const parsedDate = date.toDate ? date.toDate() : new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid Date';
    return parsedDate
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\.$/, '')
      .replace(/ /g, '');
  };

  const isAuthor = user && user.uid === post.userId;

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(id as string);
    }
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
          <CommentForm
            user={user}
            commentText={commentText}
            setCommentText={setCommentText}
            handleCommentSubmit={handleCommentSubmit}
          />

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
    </div>
  );
};

export default PostDetail;
