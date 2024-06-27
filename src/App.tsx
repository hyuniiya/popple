import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Home from './pages/main/Home';
import Map from './pages/map/Map';
import Community from './pages/community/Community';
import UserExplore from './pages/user/UserExplore';
import MyPage from './pages/user/MyPage';
import SignIn from './pages/auth/SignIn';
import HomeLayout from './components/common/layout/HomeLayout';
import Search from './pages/search/Search';
import Notification from './pages/user/Notification';
import Layout from './components/common/layout/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/map"
          element={
            <Layout>
              <Map />
            </Layout>
          }
        />
        <Route
          path="/community"
          element={
            <Layout>
              <Community />
            </Layout>
          }
        />
        <Route
          path="/user_explore"
          element={
            <Layout>
              <UserExplore />
            </Layout>
          }
        />
        <Route
          path="/mypage"
          element={
            <Layout>
              <MyPage />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignUp />
            </Layout>
          }
        />
        <Route
          path="/signin"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="/notification"
          element={
            <Layout>
              <Notification />
            </Layout>
          }
        />
        <Route path="/search" element={<Search />} />
        <Route
          path="/"
          element={
            <HomeLayout>
              <Home />
            </HomeLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
