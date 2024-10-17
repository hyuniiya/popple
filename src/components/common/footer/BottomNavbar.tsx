import { useState, useEffect } from 'react';
import { FaRegMap } from 'react-icons/fa';
import { FiUsers, FiHome, FiGlobe, FiSmile } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/store';
import LoginModal from '../modal/LoginModal';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore(state => state.user);
  const [activeMenu, setActiveMenu] = useState('/');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const handleNavigation = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      setPendingPath(path);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    navigate('/signin');
  };

  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
    setPendingPath(null);
  };

  const menuItems = [
    { path: '/map', icon: FaRegMap, text: '지도' },
    { path: '/community', icon: FiUsers, text: '커뮤니티' },
    { path: '/', icon: FiHome, text: '홈' },
    { path: '/user_explore', icon: FiGlobe, text: '유저탐색' },
    { path: '/mypage', icon: FiSmile, text: '마이페이지' },
  ];

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <div className="w-full max-w-[450px] mx-auto bg-navbar flex justify-around p-4 rounded-t-lg">
          {menuItems.map(item => (
            <div
              key={item.path}
              className={`flex flex-col items-center cursor-pointer ${
                activeMenu === item.path
                  ? 'text-primary'
                  : 'text-card-foreground hover:text-primary'
              }`}
              onClick={() =>
                item.path === '/user_explore' || item.path === '/mypage'
                  ? handleNavigation(item.path)
                  : navigate(item.path)
              }
            >
              <item.icon className="text-2xl mb-1" />
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </footer>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginCancel}
        onConfirm={handleLoginConfirm}
      />
    </>
  );
};

export default BottomNavbar;
