import { useMutation } from 'react-query';
import { changePassword } from '@/api/auth';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation<void, Error, ChangePasswordData>(
    ({ currentPassword, newPassword }) =>
      changePassword(currentPassword, newPassword),
    {
      onSuccess: () => {
        console.log('비밀번호가 성공적으로 변경되었습니다.');
      },
      onError: error => {
        console.error('비밀번호 변경 실패:', error.message);
      },
    },
  );
};
