import { useMutation, useQueryClient } from 'react-query';
import { changePassword } from '@/api/auth';

interface ChangePasswordData {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ currentPassword, newPassword }: ChangePasswordData) =>
      changePassword(currentPassword, newPassword),
    {
      onError: (error: any) => {
        if (error.code === 'auth/invalid-credential') {
          alert('현재 비밀번호가 올바르지 않습니다. 다시 확인해주세요.');
        } else {
          alert(`비밀번호 변경 실패: ${error.message}`);
        }
      },
      onSuccess: () => {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        queryClient.invalidateQueries('user');
      },
    },
  );
};
