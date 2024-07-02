import { useForm, Controller } from 'react-hook-form';
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
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      email: currentUser?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    if (data.email !== currentUser?.email) {
      alert('입력한 이메일이 현재 로그인된 계정과 일치하지 않습니다.');
      return;
    }
    changePasswordMutation.mutate(
      {
        email: data.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  if (isUserLoading) return <div>Loading...</div>;
  if (!currentUser) return <div>사용자 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded mr-6">
      <Controller
        name="email"
        control={control}
        rules={{
          required: '이메일을 입력해주세요.',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: '유효한 이메일 주소를 입력해주세요.',
          },
        }}
        render={({ field }) => (
          <TextInput type="email" {...field} placeholder="이메일을 입력하세요.">
            <span className="text-[12px] mx-4">이메일</span>
          </TextInput>
        )}
      />
      {errors.email && (
        <span className="text-red-500">{errors.email.message}</span>
      )}
      <Controller
        name="currentPassword"
        control={control}
        rules={{ required: '현재 비밀번호를 입력해주세요.' }}
        render={({ field }) => (
          <TextInput
            type="password"
            {...field}
            placeholder="현재 비밀번호를 입력하세요."
          >
            <span className="text-[12px]">현재 비밀번호</span>
          </TextInput>
        )}
      />
      {errors.currentPassword && (
        <span className="text-red-500">{errors.currentPassword.message}</span>
      )}

      <Controller
        name="newPassword"
        control={control}
        rules={{ required: '새 비밀번호를 입력해주세요.' }}
        render={({ field }) => (
          <TextInput
            type="password"
            {...field}
            placeholder="새 비밀번호를 입력하세요."
            className="bg-input text-card-foreground border border-card-foreground"
          >
            <span className="text-[12px]">신규 비밀번호</span>
          </TextInput>
        )}
      />
      {errors.newPassword && (
        <span className="text-red-500">{errors.newPassword.message}</span>
      )}

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: '비밀번호 확인을 입력해주세요.',
          validate: (val: string) =>
            val === watch('newPassword') || '비밀번호가 일치하지 않습니다.',
        }}
        render={({ field }) => (
          <TextInput
            type="password"
            {...field}
            placeholder="새 비밀번호를 확인하세요."
            className="bg-input text-card-foreground border border-card-foreground"
          >
            <span className="text-[12px]">비밀번호 확인</span>
          </TextInput>
        )}
      />
      {errors.confirmPassword && (
        <span className="text-red-500">{errors.confirmPassword.message}</span>
      )}

      <div className="flex justify-end w-full mt-4">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={changePasswordMutation.isLoading}
          className="w-[50px] h-[25px] bg-input text-card-foreground border border-card-foreground text-[12px] font-semibold mr-2 rounded-[3px]"
        >
          {changePasswordMutation.isLoading ? '변경중...' : '변경'}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
