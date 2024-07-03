import { getFollowersCount, getFollowingCount } from '@/api/user';
import { useQuery } from 'react-query';

export const useFollowCounts = (uid: string | null) => {
  return useQuery(
    ['followCounts', uid],
    async () => {
      if (!uid) return { followersCount: 0, followingCount: 0 };
      const [followers, following] = await Promise.all([
        getFollowersCount(uid),
        getFollowingCount(uid),
      ]);
      return { followersCount: followers, followingCount: following };
    },
    {
      enabled: !!uid,
    },
  );
};
