import { useQuery } from 'react-query';
import { useFollow } from '@/hooks/useFollow';
import { checkIfFollowing } from '@/api/user';

interface FollowBtnProps {
  currentUserId: string;
  targetUserId: string;
}

const FollowBtn: React.FC<FollowBtnProps> = ({
  currentUserId,
  targetUserId,
}) => {
  const { followMutation, unfollowMutation } = useFollow(currentUserId);

  const { data: isFollowing, refetch } = useQuery(
    ['followingStatus', currentUserId, targetUserId],
    () => checkIfFollowing(currentUserId, targetUserId),
    {
      initialData: false,
    },
  );

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(targetUserId);
        alert('언팔로우 되었습니다.');
      } else {
        await followMutation.mutateAsync(targetUserId);
        alert('팔로우 되었습니다.');
      }
      await refetch();
    } catch (error) {
      console.error('Error handling follow/unfollow:', error);
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <button
      className="w-[83px] h-[32px] text-[12px] font-godob border border-primary-foreground mt-3 text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors shadow-drop"
      onClick={handleClick}
      disabled={followMutation.isLoading || unfollowMutation.isLoading}
    >
      {isFollowing ? '언팔로우' : '팔로우'}
    </button>
  );
};

export default FollowBtn;
