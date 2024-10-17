import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Home from './pages/main/Home';
import Map from './pages/map/Map';
import Community from './pages/community/Community';
import UserExplore from './pages/user/UserExplore';
import MyPage from './pages/user/MyPage';
import MyPageEdit from './pages/user/MyPageEdit';
import MyPostList from './pages/user/MyPostList';
import SignIn from './pages/auth/SignIn';
import HomeLayout from './components/common/layout/HomeLayout';
import Search from './pages/search/Search';
import UserProfile from './pages/user/UserProfile';
import MyFollowList from './pages/user/MyFollowList';
import WritePost from './pages/community/WritePost';
import PostDetail from './pages/community/PostDetail';
import EditPost from './pages/community/EditPost';
import AddPopUp from './pages/admin/AddPopUp';
import EventDetail from './pages/main/EventDetail';
import Layout from './components/common/layout/Layout';
import { Outlet } from 'react-router-dom';

const LayoutWithOutlet = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutWithOutlet />}>
          <Route path="/map" element={<Map />} />
          <Route path="/community" element={<Community />} />
          <Route path="/write/:userId" element={<WritePost />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/add-popup" element={<AddPopUp />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/user_explore" element={<UserExplore />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/my/:userId/edit" element={<MyPageEdit />} />
          <Route path="/my/:userId" element={<UserProfile />} />
          <Route path="/my/:userId/follows" element={<MyFollowList />} />
          <Route path="/my/:userId/posts" element={<MyPostList />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>
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
