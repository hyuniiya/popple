import ProfileInfo from '@/components/profile/ProfileInfo';
import { useAuth } from '@/context/AuthContext';
import { useFollowCounts } from '@/hooks/useFollowCounts';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  if (!userId) {
    return <div>사용자 ID가 없습니다.</div>;
  }

  const {
    data: userInfo,
    isLoading: userLoading,
    error: userError,
  } = useUserInfo(userId);

  const {
    data: followCounts,
    isLoading: countsLoading,
    error: countsError,
  } = useFollowCounts(userId);

  if (userLoading || countsLoading) return <div>Loading...</div>;
  if (userError || countsError) return <div>나중에 다시 시도 해주세요.</div>;
  if (!user) return <div>먼저 로그인해 주세요.</div>;

  return (
    <div>
      <ProfileInfo
        userId={userId}
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

export default UserProfile;
