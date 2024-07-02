import React from 'react';
import { useForm } from 'react-hook-form';
import { useChangePassword } from '@/hooks/useChangePassword';
import { getCurrentUser } from '@/hooks/getCurrentUser';
import { TextInput } from '../common/text/TextInput';

interface ChangePasswordFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordForm: React.FC = () => {
  const { data: currentUser, isLoading: isUserLoading } = getCurrentUser();
  const changePasswordMutation = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordFormData>();

  const onSubmit = handleSubmit(data => {
    if (data.email !== currentUser?.email) {
      alert('입력한 이메일이 현재 사용자의 이메일과 일치하지 않습니다.');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  });

  if (isUserLoading) return <div>Loading...</div>;

  return (
    <div className="flex items-center">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center justify-center bg-white rounded mr-6"
      >
        <TextInput
          value={''}
          type="email"
          {...register('email', { required: '이메일은 필수입니다.' })}
          placeholder="현재 이메일을 입력하세요."
          className="ml-4"
        >
          <span className="mx-4 text-[12px]"> 이메일</span>
        </TextInput>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}

        <TextInput
          value={''}
          type="password"
          {...register('currentPassword', {
            required: '현재 비밀번호는 필수입니다.',
          })}
          placeholder="현재 비밀번호를 입력하세요."
        >
          <span className="text-[12px]">현재 비밀번호</span>
        </TextInput>
        {errors.currentPassword && (
          <span className="text-red-500">{errors.currentPassword.message}</span>
        )}

        <TextInput
          value={''}
          type="password"
          {...register('newPassword', {
            required: '새 비밀번호는 필수입니다.',
            minLength: {
              value: 6,
              message: '비밀번호는 최소 6자 이상이어야 합니다.',
            },
          })}
          placeholder="새 비밀번호를 입력하세요."
          className="bg-input text-card-foreground border border-card-foreground"
        >
          <span className="text-[12px]">신규 비밀번호</span>
        </TextInput>
        {errors.newPassword && (
          <span className="text-red-500">{errors.newPassword.message}</span>
        )}

        <TextInput
          value={''}
          type="password"
          {...register('confirmPassword', {
            required: '비밀번호 확인은 필수입니다.',
            validate: value =>
              value === watch('newPassword') || '비밀번호가 일치하지 않습니다.',
          })}
          placeholder="새 비밀번호를 확인하세요."
          className="bg-input text-card-foreground border border-card-foreground"
        >
          <span className="text-[12px]">비밀번호 확인</span>
        </TextInput>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}

        <div className="flex justify-end w-full">
          <button
            type="submit"
            disabled={changePasswordMutation.isLoading}
            className="w-[50px] h-[25px] bg-input text-card-foreground border border-card-foreground text-[12px] font-semibold mr-2 rounded-[3px]"
          >
            {changePasswordMutation.isLoading ? '변경중...' : '변경'}
          </button>
        </div>
        {changePasswordMutation.isError && (
          <div className="mt-2 text-red-500">
            Error:{' '}
            {changePasswordMutation.error instanceof Error
              ? changePasswordMutation.error.message
              : '알 수 없는 오류가 발생했습니다.'}
          </div>
        )}
        {changePasswordMutation.isSuccess && (
          <div className="mt-2">비밀번호 변경이 완료되었습니다!</div>
        )}
      </form>
    </div>
  );
};

export default ChangePasswordForm;
