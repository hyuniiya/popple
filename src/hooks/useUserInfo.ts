import { getUserInfo } from '@/api/user';
import { UserData } from '@/types';
import { useQuery } from 'react-query';

export const useUserInfo = (userId: string) => {
  return useQuery<UserData | null, Error>(
    ['UserData', userId],
    () => {
      if (!userId) {
        throw new Error('회원을 찾을 수 없습니다.');
      }
      return getUserInfo(userId);
    },
    {
      enabled: !!userId,
    },
  );
};
