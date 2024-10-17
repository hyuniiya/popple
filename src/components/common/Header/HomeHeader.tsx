import { PiMapPinPlusLight } from 'react-icons/pi';
import SearchIcon from '@/assets/images/search_icon.png';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';

const Header = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();

  const handleGoSearch = () => {
    navigate('/search');
  };

  const handleGoAddPopup = () => navigate('/add-popup');

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <header className="fixed top-0 left-0 right-0 z-10">
      <div className="w-full max-w-[450px] mx-auto px-4 pb-4 bg-primary rounded-b-lg">
        <div className="pt-3 pb-3 flex items-center justify-between">
          <span className="font-museo text-white text-base">popple</span>
          <div className="flex items-center">
            {isAdmin && (
              <PiMapPinPlusLight
                className="text-white text-base cursor-pointer mr-4"
                onClick={handleGoAddPopup}
              />
            )}
          </div>
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
