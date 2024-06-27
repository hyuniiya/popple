import { FaRegMap } from 'react-icons/fa';
import { FiUsers, FiHome, FiGlobe, FiSmile } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const BottomNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className=" w-[450px] bg-navbar  flex justify-around p-4 rounded-t-lg ">
      <div
        className="flex flex-col items-center text-card-foreground hover:text-primary cursor-pointer"
        onClick={() => navigate('/map')}
      >
        <FaRegMap className="text-2xl mb-1" />
        <span className="text-sm">지도</span>
      </div>
      <div
        className="flex flex-col items-center text-card-foreground hover:text-primary cursor-pointer"
        onClick={() => navigate('/community')}
      >
        <FiUsers className="text-2xl mb-1" />
        <span className="text-sm">커뮤니티</span>
      </div>
      <div
        className="flex flex-col items-center text-card-foreground hover:text-primary cursor-pointer"
        onClick={() => navigate('/')}
      >
        <FiHome className="text-2xl mb-1" />
        <span className="text-sm">홈</span>
      </div>
      <div
        className="flex flex-col items-center text-card-foreground hover:text-primary cursor-pointer"
        onClick={() => navigate('/user_explore')}
      >
        <FiGlobe className="text-2xl mb-1" />
        <span className="text-sm">유저탐색</span>
      </div>
      <div
        className="flex flex-col items-center text-card-foreground hover:text-primary cursor-pointer"
        onClick={() => navigate('/mypage')}
      >
        <FiSmile className="text-2xl mb-1" />
        <span className="text-sm">마이페이지</span>
      </div>
    </div>
  );
};

export default BottomNavbar;
