import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SignUpData } from '@/types';
import Input from '../input/Input';
import { signUp } from '@/api/auth';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>();

  const handleSignUp = async (formData: SignUpData) => {
    try {
      const user = await signUp(formData);
      console.log('Signed up user:', user);
      alert('회원가입이 완료되었습니다.');
      navigate('/signin');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('이미 가입된 이메일입니다.');
      } else {
        alert('회원가입에 실패하였습니다');
      }
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="w-full max-w-[250px] mx-auto">
      <h1 className="text-[22px] text-primary font-godob ">회원가입</h1>
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="flex flex-col items-center justify-center gap-5 h-full my-0 mx-auto p-4"
      >
        <div className="flex items-center justify-center">
          <img
            src="/src/assets/images/user_img.png"
            alt="user_img_basic"
            className="w-[72px] h-[72px]"
          />
        </div>
        <Input
          id="email"
          label="이메일"
          type="text"
          error={errors.email?.message}
          placeholder={'email@email.com'}
          register={register}
          {...register('email', {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-.]+$/,
              message: '유효한 이메일 주소를 입력해주세요.',
            },
            required: '이메일을 입력해주세요.',
          })}
        />
        <Input
          id="password"
          label="비밀번호"
          type="password"
          error={errors.password?.message}
          placeholder={'문자,숫자,특수문자 8자 이상'}
          register={register}
          {...register('password', {
            pattern: {
              value:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message: '영문 + 숫자 + 특수문자 8자 이상 입력해주세요.',
            },
            required: '비밀번호를 입력해주세요.',
          })}
        />
        <Input
          id="name"
          label="이름"
          type="text"
          error={errors.name?.message}
          placeholder={'문자 2자 이상'}
          register={register}
          {...register('name', {
            minLength: 2,
            required: '이름을 입력해주세요.',
          })}
        />
        <Input
          id="nickname"
          label="닉네임"
          type="text"
          error={errors.nickname?.message}
          placeholder={'문자 2자 이상'}
          register={register}
          {...register('nickname', {
            minLength: 2,
            required: '닉네임을 입력해주세요.',
          })}
        />
        <Input
          id="bio"
          label="자기소개"
          type="text"
          error={errors.bio?.message}
          placeholder={'간략한 자기소개를 해보세요.'}
          register={register}
          {...register('bio', {
            minLength: 3,
            required: '인사말을 입력해주세요.',
          })}
        />
        <div className="w-[250px] h-[50px] bg-primary rounded-[3px]">
          <button
            type="submit"
            className="w-full h-full font-godob text-white text-lg font-bold rounded-[3px] bg-primary border-none outline-none shadow-drop"
          >
            회원가입
          </button>
        </div>
      </form>
      <div className="flex justify-center space-x-4 text-[14px] pb-4">
        <span className="text-[#555555]">이미 계정이 있으신가요?</span>
        <span
          onClick={() => navigate('/signin')}
          className="font-semibold cursor-pointer"
        >
          로그인하기
        </span>
      </div>
    </div>
  );
};

export default SignUpForm;
