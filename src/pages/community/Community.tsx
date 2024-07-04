import { PostList } from '@/components/post/PostList';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleWriteClick = () => {
    if (user) {
      navigate(`/write/${user.uid}`);
    } else {
      alert('글을 작성하려면 로그인이 필요합니다.');
      navigate('/signin');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-[430px] mx-auto mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-primary text-[22px] font-godob">게시판</h1>
          <button
            onClick={handleWriteClick}
            className="flex items-center bg-primary-foreground hover:bg-primary text-white text-[13px] py-2 px-5 rounded gap-1 font-godob"
          >
            <FaEdit className="text-lg" />
            글쓰기
          </button>
        </div>
      </div>
      <PostList />
    </div>
  );
};

export default Community;
