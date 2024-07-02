import { useAuth } from '@/context/AuthContext';
import { getCurrentUser } from '@/hooks/getCurrentUser';
import ChangePasswordForm from '@/components/forms/ChangePasswordForm';
import { IoCameraReverse } from 'react-icons/io5';
import { TextInput } from '@/components/common/text/TextInput';

const MyPageEdit = () => {
  const { user } = useAuth();
  const { data: userInfo, isLoading, error } = getCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>프로필을 보려면 먼저 로그인해 주세요.</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
  };

  return (
    <div className="flex flex-col mt-10 mb-4">
      <h1 className="text-[22px] text-primary font-godob mb-6">내 정보 수정</h1>
      {userInfo && (
        <div className="flex flex-col items-center w-[400px]">
          <div className="relative cursor-pointer mb-6">
            <img
              src="/src/assets/images/user_img.png"
              alt="user_img_basic"
              className="w-[68px] h-[68px] rounded-full shadow-drop border border-white"
            />
            <div className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-primary rounded-full border border-white shadow-drop flex items-center justify-center">
              <IoCameraReverse className="w-[14px] h-[14px] text-white" />
            </div>
          </div>
          <TextInput
            type="text"
            value={userInfo.nickname || ''}
            onChange={handleInputChange}
            placeholder="닉네임을 입력하세요."
            required
          >
            <label className="mr-2 text-[12px]">닉네임</label>
          </TextInput>
          <TextInput
            type="text"
            value={userInfo.bio || ''}
            onChange={handleInputChange}
            placeholder="소개글을 입력하세요."
          >
            <label className="mr-2 text-[12px]">소개글</label>
          </TextInput>
          <TextInput
            type="email"
            value={userInfo.email || ''}
            onChange={handleInputChange}
            placeholder="이메일을 입력하세요."
            required
          >
            <label className="mr-2 text-[12px]">이메일</label>
          </TextInput>

          <ChangePasswordForm />
          <button className="w-[70px] h-[30px] bg-primary text-white font-godob text-[14px] rounded-sm">
            저장
          </button>
        </div>
      )}
      <div className="flex justify-center itmes-center gap-4 text-[12px] pt-6">
        <span className="text-card-foreground cursor-pointer underline">
          로그아웃
        </span>
        <div className="w-[0.5px] h-5 bg-card-foreground"></div>
        <span className="text-card-foreground cursor-pointer underline">
          회원탈퇴
        </span>
      </div>
    </div>
  );
};

export default MyPageEdit;
