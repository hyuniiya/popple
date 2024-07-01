import { useAuth } from '@/context/AuthContext';
import { getCurrentUser } from '@/hooks/getCurrentUser';

const MyPageEdit = () => {
  const { user } = useAuth();
  const { data: userInfo, isLoading, error } = getCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>프로필을 보려면 먼저 로그인해 주세요.</div>;

  return (
    <div>
      <h1>내 정보 수정</h1>
      {userInfo && (
        <div>
          <img src={userInfo.profileImg} alt="Profile" />
          <p>Nickname: {userInfo.nickname}</p>
          <p>Email: {userInfo.email}</p>
          <p>Bio: {userInfo.bio}</p>
        </div>
      )}
    </div>
  );
};

export default MyPageEdit;
