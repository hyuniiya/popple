import { getCurrentUserInfo } from '@/api/user';
import { useAuth } from '@/context/AuthContext';
import { UserData } from '@/types';
import { useQuery } from 'react-query';

export const getCurrentUser = () => {
  const { user } = useAuth();

  return useQuery<UserData | null, Error>(
    ['UserData', user?.uid],
    () => {
      if (!user?.uid) {
        throw new Error('회원을 찾을 수 없습니다.');
      }
      return getCurrentUserInfo(user.uid);
    },
    {
      enabled: !!user?.uid,
    },
  );
};
