import { FaRegEdit } from 'react-icons/fa';
import { RiArrowRightWideFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

interface ProfileInfoProps {
  userId: string;
  profileImgUrl: string;
  nickname: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isCurrentUser: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userId,
  profileImgUrl,
  nickname,
  bio,
  followersCount,
  followingCount,
  isCurrentUser,
}) => {
  const navigate = useNavigate();

  const goToUserPageEdit = () => {
    if (isCurrentUser) {
      navigate(`/my/${userId}/edit`);
    }
  };

  const goToUserPostList = () => {
    navigate(`/my/${userId}/posts`);
  };

  const goToMyFollowList = () => {
    if (isCurrentUser) {
      navigate(`/my/${userId}/follows`);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute top-0 right-24 flex items-center cursor-pointer"
        onClick={goToUserPostList}
      >
        <span className="text-[10px] text-primary font-godob font-thin mr-1">
          게시글 바로가기
        </span>
        <RiArrowRightWideFill className="w-[12px] h-[12px]" />
      </div>

      {/* 프로필 정보 섹션 */}
      <div className="flex flex-col items-center">
        <div className="relative cursor-pointer" onClick={goToUserPageEdit}>
          <img
            src={profileImgUrl || '/src/assets/images/user_img.png'}
            alt="user_img_basic"
            className="w-[68px] h-[68px] rounded-full shadow-drop border border-white"
          />
          {isCurrentUser && (
            <div className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-primary rounded-full border border-white shadow-drop flex items-center justify-center">
              <FaRegEdit className="w-[14px] h-[14px] text-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[16px] text-foreground font-godob font-semibold">
            {nickname}
          </span>
          <p className="text-[12px] text-border text-center font-godob mt-1">
            {bio}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mx-10 my-4">
        <div className="flex flex-row items-center">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={goToMyFollowList}
          >
            <span className="text-[14px] font-godob">팔로워</span>
            <span className="text-[16px] font-semibold">{followersCount}</span>
          </div>
          <div className="w-[0.4px] h-12 bg-border mx-8" />
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={goToMyFollowList}
          >
            <span className="text-[14px] font-godob">팔로잉</span>
            <span className="text-[16px] font-semibold">{followingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
