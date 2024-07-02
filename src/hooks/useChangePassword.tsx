import { useMutation } from 'react-query';
import { changePassword } from '@/api/auth';

const useChangePassword = () => {
  return useMutation(changePassword, {
    onSuccess: () => {
      console.log('비밀번호 변경을 완료했습니다!');
    },
    onError: error => {
      console.error('비밀번호 변경 실패:', error);
    },
  });
};

export default useChangePassword;
