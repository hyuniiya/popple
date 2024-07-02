import React, { useState } from 'react';
import useChangePassword from '@/hooks/useChangePassword';
import { TextInput } from '../common/text/TextInput';

interface ChangePasswordError {
  message: string;
}

const ChangePasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const changePasswordMutation = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    changePasswordMutation.mutate(newPassword);
  };

  return (
    <div className="flex items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center bg-white rounded mr-6"
      >
        <TextInput
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="기존 비밀번호를 입력하세요."
          required
        >
          <span className=" text-[12px]">기존 비밀번호</span>
        </TextInput>
        <TextInput
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호를 입력하세요."
          required
          className="bg-input text-card-foreground border border-card-foreground"
        >
          <span className="text-[12px]">신규 비밀번호</span>
        </TextInput>
        <TextInput
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호를 확인하세요."
          required
          className="bg-input text-card-foreground border border-card-foreground"
        >
          <span className="text-[12px]">비밀번호 확인</span>
        </TextInput>
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
            {(changePasswordMutation.error as ChangePasswordError).message}
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
