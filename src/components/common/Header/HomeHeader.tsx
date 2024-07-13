import { FaRegBell } from 'react-icons/fa';
import SearchIcon from '@/assets/images/search_icon.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleGoSearch = () => {
    navigate('/search');
  };

  const handleGoNoti = () => {
    navigate('/notification');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10">
      <div className="w-full max-w-[450px] mx-auto px-4 pb-4 bg-primary rounded-b-lg">
        <div className="flex items-center justify-between">
          <span className="font-museo text-white text-base">popple</span>
          <FaRegBell
            className="h-[54px] left-0 text-base text-white cursor-pointer"
            onClick={handleGoNoti}
          />
        </div>
        <div
          className="flex h-[30px] items-center bg-white cursor-pointer"
          onClick={handleGoSearch}
        >
          <img src={SearchIcon} alt="Icon" className="w-4 h-4 mx-2" />
          <span className="text-[14px] text-card-foreground">
            지역명,팝업 키워드를 입력해주세요.
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
