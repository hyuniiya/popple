import { useMutation, useQueryClient } from 'react-query';
import { followUser, unfollowUser } from '@/api/user';

export const useFollow = (currentUserId: string) => {
  const queryClient = useQueryClient();

  const followMutation = useMutation(
    (targetUserId: string) => followUser(currentUserId, targetUserId),
    {
      onSuccess: () => {
        console.log('Follow mutation succeeded');
        queryClient.invalidateQueries(['follows', currentUserId]);
        queryClient.invalidateQueries(['followers', currentUserId]);
      },
    },
  );

  const unfollowMutation = useMutation(
    (targetUserId: string) => unfollowUser(currentUserId, targetUserId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['follows', currentUserId]);
        queryClient.invalidateQueries(['followers', currentUserId]);
      },
    },
  );

  return {
    followMutation,
    unfollowMutation,
  };
};
