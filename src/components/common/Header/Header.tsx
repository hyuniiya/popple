import logo from '@/assets/images/logo_x.png';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-10">
      <div className="flex w-full max-w-[450px] mx-auto mt-4 pb-4">
        <FiChevronLeft
          className="h-[62px] left-0 text-2xl text-primary cursor-pointer"
          onClick={handleGoBack}
        />
        <div className="flex-grow flex justify-center items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-40 h-auto cursor-pointer"
            onClick={handleGoHome}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
