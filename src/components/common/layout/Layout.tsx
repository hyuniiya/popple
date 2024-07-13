import BottomNavbar from '../footer/BottomNavbar';
import Header from '../Header/Header';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen w-full max-w-[430px] mx-auto overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto scrollbar-hide pt-[102px] pb-[80px]">
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
};

export default Layout;
