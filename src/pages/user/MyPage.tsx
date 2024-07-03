import { useAuth } from '@/context/AuthContext';
import { useFollowCounts } from '@/hooks/useFollowCounts';
import ProfileInfo from '@/components/profile/ProfileInfo';
import { useUserInfo } from '@/hooks/useUserInfo';

const MyPage = () => {
  const { user } = useAuth();

  const {
    data: userInfo,
    isLoading: userLoading,
    error: userError,
  } = useUserInfo(user?.uid || '');

  const {
    data: followCounts,
    isLoading: countsLoading,
    error: countsError,
  } = useFollowCounts(user?.uid ?? null);

  if (userLoading || countsLoading) return <div>Loading...</div>;
  if (userError || countsError) return <div>나중에 다시 시도 해주세요.</div>;
  if (!user) return <div>먼저 로그인해 주세요.</div>;

  return (
    <div>
      <ProfileInfo
        userId={user.uid}
        profileImgUrl={userInfo?.profileImgUrl || ''}
        nickname={userInfo?.nickname || ''}
        bio={userInfo?.bio || ''}
        followersCount={followCounts?.followersCount || 0}
        followingCount={followCounts?.followingCount || 0}
        isCurrentUser={true}
      />
      {/* 찜 목록 리스트 */}
    </div>
  );
};

export default MyPage;
