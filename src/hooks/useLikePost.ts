import { useMutation, useQueryClient } from 'react-query';
import { toggleLike } from '@/api/post';

export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation((userId: string) => toggleLike(postId, userId), {
    onMutate: async userId => {
      await queryClient.cancelQueries(['isLiked', postId, userId]);
      const previousIsLiked = queryClient.getQueryData([
        'isLiked',
        postId,
        userId,
      ]);

      queryClient.setQueryData(
        ['isLiked', postId, userId],
        (old: boolean | undefined) => !old,
      );

      return { previousIsLiked };
    },
    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        ['isLiked', postId, variables],
        context?.previousIsLiked,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(['post', postId]);
      queryClient.invalidateQueries(['likes', postId]);
      queryClient.invalidateQueries('posts');
    },
  });
};
