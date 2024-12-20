import { useMutation, useQueryClient, useQuery } from 'react-query';
import {
  toggleCommentLike,
  getCommentLikesCount,
  isCommentLikedByUser,
} from '@/api/comment';

export const useCommentLike = (
  commentId: string,
  userId: string | null,
  onLoginRequired: () => void = () => {},
) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation(
    () => toggleCommentLike(commentId, userId!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['commentLikes', commentId]);
        queryClient.invalidateQueries(['isCommentLiked', commentId, userId]);
      },
    },
  );

  const { data: likesCount = 0 } = useQuery(
    ['commentLikes', commentId],
    () => getCommentLikesCount(commentId),
    { enabled: !!commentId },
  );

  const { data: isLiked = false } = useQuery(
    ['isCommentLiked', commentId, userId],
    () =>
      userId ? isCommentLikedByUser(commentId, userId) : Promise.resolve(false),
    { enabled: !!commentId && !!userId },
  );

  const toggleLike = () => {
    if (userId) {
      likeMutation.mutate();
    } else {
      onLoginRequired();
    }
  };

  return { likesCount, isLiked, toggleLike };
};
