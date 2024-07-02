import { FaRegEdit } from 'react-icons/fa';
import { RiArrowRightWideFill } from 'react-icons/ri';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUser } from '@/hooks/getCurrentUser';
import { useFollowCounts } from '@/hooks/useFollowCounts';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: userInfo,
    isLoading: userLoading,
    error: userError,
  } = getCurrentUser();

  const {
    data: followCounts,
    isLoading: countsLoading,
    error: countsError,
  } = useFollowCounts(user?.uid ?? null);

  if (userLoading || countsLoading) return <div>Loading...</div>;
  if (userError || countsError) return <div>나중에 다시 시도 해주세요.</div>;
  if (!user) return <div>먼저 로그인해 주세요.</div>;

  const goToMyPageEdit = () => {
    navigate(`/my/${user.uid}/edit`);
  };

  const goToMyPostList = () => {
    navigate(`/my/${user.uid}/posts`);
  };

  const goToMyNotiList = () => {
    navigate(`/my/${user.uid}/noti`);
  };
  return (
    <div className="flex ">
      <div className="flex flex-col items-center">
        <div className="relative cursor-pointer" onClick={goToMyPageEdit}>
          <img
            src={userInfo?.profileImgUrl || '/src/assets/images/user_img.png'}
            alt="user_img_basic"
            className="w-[68px] h-[68px] rounded-full shadow-drop border border-white"
          />
          <div className="absolute bottom-0 right-0 w-[22px] h-[22px]  bg-primary rounded-full border border-white shadow-drop flex items-center justify-center">
            <FaRegEdit className="w-[14px] h-[14px] text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[16px] text-foreground font-godob font-semibold">
            {userInfo?.nickname}
          </span>
          <p className="text-[12px] text-border text-center font-godob mt-1">
            {userInfo?.bio}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center mx-10 my-2">
        <div className="flex flex-row items-center">
          <div className="flex flex-col items-center">
            <span className="text-[14px] font-godob">팔로워</span>
            <span className="text-[16px] font-semibold">
              {followCounts?.followersCount}
            </span>
          </div>
          <div className="w-[0.4px] h-12 bg-border mx-8" />
          <div className="flex flex-col items-center">
            <span className="text-[14px] font-godob">팔로잉</span>
            <span className="text-[16px] font-semibold">
              {followCounts?.followingCount}
            </span>
          </div>
        </div>
        <div className="flex items-center mt-5">
          <div
            className="flex items-center cursor-pointer"
            onClick={goToMyPostList}
          >
            <span className="text-[10px] font-godob font-thin ml-1">
              게시글 바로가기
            </span>
            <RiArrowRightWideFill className="w-[12px] h-[12px] mr-5" />
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={goToMyNotiList}
          >
            <span className="text-[10px] font-godob font-thin ml-2">
              알림 바로가기
            </span>
            <RiArrowRightWideFill className="w-[12px] h-[12px]" />
          </div>
        </div>
        {/* 찜 목록 리스트 */}
      </div>
    </div>
  );
};

export default MyPage;
