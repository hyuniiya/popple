import SearchIcon from '@/assets/images/search_icon.png';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '@/components/common/footer/BottomNavbar';
const Search = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-[430px] my-6 mx-auto ">
      <div className="flex items-center w-[450px] p-4">
        <FiChevronLeft
          className="h-[62px] left-0 text-2xl text-primary cursor-pointer"
          onClick={handleGoBack}
        />
        <div
          className="flex-grow flex justify-center items-center bg-navbar rounded-lg px-2 mx-14 h-[35px]
        "
        >
          <img src={SearchIcon} alt="Icon" className="w-4 h-4 mx-2" />
          <input
            type="text"
            placeholder="지역명, 팝업 키워드를 입력해주세요."
            className="text-[14px] flex-grow outline-none border-0 bg-transparent text-card-foreground"
          />
        </div>
      </div>
      search
      <BottomNavbar />
    </div>
  );
};

export default Search;
