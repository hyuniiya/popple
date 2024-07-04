import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserInfo } from '@/hooks/useUserInfo';
import ChangePasswordForm from '@/components/forms/ChangePasswordForm';
import { IoCameraReverse } from 'react-icons/io5';
import { TextInput } from '@/components/input/TextInput';
import { updateUserProfile } from '@/api/user';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/api/firebase';
import { useUserStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '@/api/auth';

const MyPageEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data: fetchedUserInfo,
    isLoading,
    error,
    refetch,
  } = useUserInfo(user?.uid || '');
  const [userInfo, setUserInfo] = useState(fetchedUserInfo);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fetchedUserInfo) {
      setUserInfo(fetchedUserInfo);
      setNickname(fetchedUserInfo.nickname || '');
      setBio(fetchedUserInfo.bio || '');
    }
  }, [fetchedUserInfo]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>프로필을 보려면 먼저 로그인해 주세요.</div>;

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImg(e.target.files[0]);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      useUserStore.getState().setUser(null);
      alert('로그아웃되었습니다.');
      navigate('/signin');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 중 문제가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: any = {};
      if (nickname !== userInfo?.nickname) updateData.nickname = nickname;
      if (bio !== userInfo?.bio) updateData.bio = bio;
      if (profileImg) updateData.profileImg = profileImg;

      if (Object.keys(updateData).length > 0) {
        const updatedProfile = await updateUserProfile(user.uid, updateData);
        setUserInfo(prevInfo => ({
          ...prevInfo,
          ...updatedProfile,
        }));
        alert('프로필이 업데이트되었습니다.');
        refetch();
      } else {
        alert('변경된 정보가 없습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  const handleDeleteAccountClick = async () => {
    if (!user) return;

    const confirmDelete = window.confirm(
      '정말로 회원탈퇴 하시겠습니까? 탈퇴 후 되돌릴 수 없습니다.',
    );
    if (!confirmDelete) return;

    try {
      await deleteAccount(user as User);
      useUserStore.getState().setUser(null);
      alert('회원탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('회원탈퇴 중 오류 발생:', error);
      alert('회원탈퇴 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col mt-10 mb-4">
      <h1 className="text-[22px] text-primary font-godob mb-6">내 정보 수정</h1>
      {userInfo && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-[400px]"
        >
          <div
            className="relative cursor-pointer mb-6"
            onClick={handleImageClick}
          >
            <img
              src={
                profileImg
                  ? URL.createObjectURL(profileImg)
                  : userInfo.profileImgUrl || '/src/assets/images/user_img.png'
              }
              alt="user_img"
              className="w-[68px] h-[68px] rounded-full shadow-drop border border-white"
            />
            <div className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-primary rounded-full border border-white shadow-drop flex items-center justify-center">
              <IoCameraReverse className="w-[14px] h-[14px] text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <TextInput
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력하세요."
            required
          >
            <label className="mr-2 text-[12px]">닉네임</label>
          </TextInput>
          <TextInput
            type="text"
            value={bio}
            onChange={handleBioChange}
            placeholder="소개글을 입력하세요."
          >
            <label className="mr-2 text-[12px]">소개글</label>
          </TextInput>

          <ChangePasswordForm
            currentUser={fetchedUserInfo}
            isLoading={isLoading}
          />
          <button
            type="submit"
            className="w-[70px] h-[30px] bg-primary text-white font-godob text-[14px] rounded-sm"
          >
            저장
          </button>
        </form>
      )}
      <div className="flex justify-center itmes-center gap-4 text-[12px] pt-6">
        <span
          className="text-card-foreground cursor-pointer underline"
          onClick={handleLogout}
        >
          로그아웃
        </span>
        <div className="w-[0.5px] h-5 bg-card-foreground"></div>
        <span
          className="text-card-foreground cursor-pointer underline"
          onClick={handleDeleteAccountClick}
        >
          회원탈퇴
        </span>
      </div>
    </div>
  );
};

export default MyPageEdit;
