import BottomNavbar from '../footer/BottomNavbar';
import Header from '../header/Header';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-[430px] mx-auto ">
      <Header />
      {children}
      <BottomNavbar />
    </div>
  );
};

export default Layout;
