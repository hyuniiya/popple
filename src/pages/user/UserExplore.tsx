import { useQuery } from 'react-query';
import { getAllUsers } from '@/api/user';
import FollowBtn from '@/components/button/FollowBtn';
import { useAuth } from '@/context/AuthContext';

function UserExplore() {
  const { user } = useAuth();
  const currentUserId: string = user?.uid || '';

  const { data, isLoading, isError } = useQuery('users', getAllUsers);

  if (!currentUserId) {
    return <p>로그인 상태가 아닙니다.</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5">
      {data && data.length > 0 ? (
        data.map(user => {
          return (
            <div
              key={user.uid}
              className="flex flex-col justify-center items-center w-[180px] h-[150px] border border-border rounded-[12px]"
            >
              <div className="flex items-center">
                <img
                  src={user.profileImg || '/src/assets/images/user_img.png'}
                  alt="Profile_Img"
                  className="w-[58px] h-[58px] rounded-full shadow-md mr-3"
                />
                <div className="flex flex-col items-center">
                  <span className="text-[16px] text-foreground font-godob font-semibold">
                    {user.nickname}
                  </span>
                  <p className="text-[14px] text-border text-center font-godob mt-1">
                    {user.bio}
                  </p>
                </div>
              </div>
              <FollowBtn
                currentUserId={currentUserId}
                targetUserId={user.uid}
              />
            </div>
          );
        })
      ) : (
        <p>등록된 회원 정보가 없습니다.</p>
      )}
    </div>
  );
}

export default UserExplore;
