import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TabButtons from '@/components/button/TabButtons';
import UserListItem from '@/components/profile/UserListItem';

import { getUserFollowers, getUserFollowing } from '@/api/user';
import { useFollow } from '@/hooks/useFollow';

interface UserData {
  uid: string;
  nickname?: string;
  profileImgUrl?: string;
}

const MyFollowListPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  console.log('Current uid:', userId);

  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(
    'followers',
  );
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [following, setFollowing] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = 'current-user-id'; // 실제 인증 시스템에서 가져와야 합니다
  const { followMutation, unfollowMutation } = useFollow(currentUserId);

  useEffect(() => {
    const fetchFollowData = async () => {
      if (userId) {
        setIsLoading(true);
        console.log('Fetching data for userId:', userId);
        try {
          const [followersData, followingData] = await Promise.all([
            getUserFollowers(userId),
            getUserFollowing(userId),
          ]);
          console.log('Followers data:', followersData);
          console.log('Following data:', followingData);
          setFollowers(followersData);
          setFollowing(followingData);
        } catch (error) {
          console.error('Error fetching follow data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFollowData();
  }, [userId]);

  const handleFollowToggle = (targetUserId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate(targetUserId);
    } else {
      followMutation.mutate(targetUserId);
    }
  };

  const renderUserList = (users: UserData[]) => {
    if (isLoading) return <div>Loading...</div>;
    if (!users || users.length === 0) {
      return <div>팔로우가 없습니다.</div>;
    }

    return (
      <div className="space-y-4">
        {users.map(user => (
          <UserListItem
            key={user.uid}
            user={user}
            currentUserId={currentUserId}
            onFollowToggle={handleFollowToggle}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <TabButtons
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          { id: 'followers', label: '팔로워' },
          { id: 'following', label: '팔로잉' },
        ]}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {activeTab === 'followers'
            ? renderUserList(followers)
            : renderUserList(following)}
        </>
      )}
    </div>
  );
};

export default MyFollowListPage;
