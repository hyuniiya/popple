import BottomNavbar from '../footer/BottomNavbar';
import HomeHeader from '../Header/HomeHeader';

const HomeLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-[430px] my-6 mx-auto p-3">
      <HomeHeader />
      {children}
      <BottomNavbar />
    </div>
  );
};

export default HomeLayout;
