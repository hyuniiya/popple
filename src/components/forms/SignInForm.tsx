import { useEffect } from 'react';
import { auth } from '@/api/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../input/Input';
import { SignUpData } from '@/types';
import { useNavigate } from 'react-router-dom';
import google from '@/assets/images/google_logo_icon.png';
import github from '@/assets/images/github_logo_icon.png';
import { useUserStore } from '@/store/store';

function SignInForm() {
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user); // 로그인 상태 업데이트
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 정리
  }, [setUser]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>();

  const signIn: SubmitHandler<SignUpData> = async data => {
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('user with signIn', userCredential.user);
      alert('로그인 되었습니다!');
      setUser(userCredential.user);
      navigate('/');
    } catch (error) {
      const errorCode = (error as any).code;
      const errorMessage = (error as any).message;
      console.log('error with signIn', errorCode, errorMessage);
    }
  };

  return (
    <div className="pt-24 w-full max-w-[250px] mx-auto">
      <h2 className="text-[22px] text-primary font-godob">로그인</h2>
      <form
        onSubmit={handleSubmit(signIn)}
        className="flex flex-col items-center justify-center gap-5 h-full my-0 mx-auto p-4"
      >
        <Input
          id="email"
          label="이메일"
          type="text"
          error={errors.email?.message as string}
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
          error={errors.password?.message as string}
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
        <div className="flex w-[250px] h-[50px] bg-primary rounded-[3px]">
          <button
            type="submit"
            className="w-full h-full font-godob text-white text-lg font-bold rounded-[3px] bg-primary border-none outline-none shadow-drop "
          >
            로그인
          </button>
        </div>
      </form>
      <div className="flex justify-center space-x-4 text-[14px] pb-4">
        <span className="text-[#555555]">아직 회원이 아니신가요?</span>
        <span
          onClick={() => navigate('/signup')}
          className="font-semibold cursor-pointer"
        >
          회원가입하기
        </span>
      </div>
      <div className="flex items-center w-full px-4 pt-3">
        <hr className="flex-grow border-t border-border" />
        <span className="mx-2 text-[12px] text-card-foreground">
          SNS 계정으로 로그인
        </span>
        <hr className="flex-grow border-t border-border" />
      </div>
      <div className="flex items-center justify-center py-10">
        <img
          src={google}
          alt="google_logo"
          className="w-10 h-auto cursor-pointer mx-2"
        />
        <img
          src={github}
          alt="github_logo"
          className="w-10 h-auto cursor-pointer mx-2"
        />
      </div>
    </div>
  );
}

export default SignInForm;
