import { useState, useEffect } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import {
  fetchComments,
  createComment,
  getCommentsCount,
  updateComment,
  deleteComment,
} from '@/api/comment';
import { QueryDocumentSnapshot } from 'firebase/firestore';

export const useComments = (postId: string) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { ref, inView } = useInView();

  const { data: commentsCount = 0 } = useQuery(
    ['commentsCount', postId],
    () => getCommentsCount(postId),
    { enabled: !!postId },
  );

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isLoading: commentsLoading,
    refetch,
  } = useInfiniteQuery(
    ['comments', postId],
    ({ pageParam = null }) =>
      fetchComments(postId, pageParam as QueryDocumentSnapshot | null),
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      enabled: showComments && !!postId,
    },
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleCommentSubmit = async (userId: string) => {
    if (!commentText.trim()) return;
    await createComment(postId, userId, commentText);
    setCommentText('');
    refetch();
  };

  const handleCommentUpdate = async (commentId: string, text: string) => {
    await updateComment(commentId, text);
    refetch();
  };

  const handleCommentDelete = async (commentId: string) => {
    await deleteComment(commentId);
    refetch();
  };

  return {
    showComments,
    setShowComments,
    commentText,
    setCommentText,
    commentsData,
    commentsLoading,
    handleCommentSubmit,
    ref,
    hasNextPage,
    commentsCount,
    handleCommentUpdate,
    handleCommentDelete,
  };
};
