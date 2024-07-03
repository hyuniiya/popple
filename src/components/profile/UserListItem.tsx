const UserListItem: React.FC<{
  user: any;
  currentUserId: any;
  onFollowToggle: (targetUserId: string, isFollowing: boolean) => void;
}> = ({ user, currentUserId, onFollowToggle }) => (
  <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
    <div className="flex items-center">
      <img
        src={user.profileImgUrl}
        alt={user.nickname}
        className="w-12 h-12 rounded-full mr-4"
      />
      <span className="font-semibold">{user.nickname}</span>
    </div>
    {user.uid !== currentUserId && (
      <button
        onClick={() => onFollowToggle(user.uid, false)}
        className="w-[70px] h-[35px] font-godob text-[12px] px-4 py-2 bg-primary-foreground text-white rounded-[5px] hover:bg-primary"
      >
        팔로잉
      </button>
    )}
  </div>
);
export default UserListItem;
