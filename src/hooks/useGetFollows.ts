import { useQuery } from 'react-query';
import { getUserFollowers, getUserFollowing } from '@/api/user';

export const useGetFollows = (uid: string | undefined) => {
  const { data: followers, isLoading: isFollowersLoading } = useQuery(
    ['followers', uid],
    () => getUserFollowers(uid ?? ''),
    { enabled: !!uid },
  );

  const { data: following, isLoading: isFollowingLoading } = useQuery(
    ['following', uid],
    () => getUserFollowing(uid ?? ''),
    { enabled: !!uid },
  );

  return { followers, following, isFollowersLoading, isFollowingLoading };
};
