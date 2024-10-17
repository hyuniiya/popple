import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFollowCounts } from '@/hooks/useFollowCounts';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useGetBookmark } from '@/hooks/useGetBookmark';
import { getBookmarkedEvents } from '@/api/bookmark';
import ProfileInfo from '@/components/profile/ProfileInfo';
import BookmarkCard from '@/components/profile/BookmarkCard';
import { EventData } from '@/types';

const MyPage = () => {
  const { user } = useAuth();
  const [bookmarkedEvents, setBookmarkedEvents] = useState<EventData[]>([]);

  const {
    data: userInfo,
    isLoading: userLoading,
    error: userError,
  } = useUserInfo(user?.uid || '');

  const {
    data: followCounts,
    isLoading: countsLoading,
    error: countsError,
  } = useFollowCounts(user?.uid ?? null);

  const {
    bookmarks,
    loading: bookmarksLoading,
    error: bookmarksError,
  } = useGetBookmark(user?.uid || '');

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      if (bookmarks.length > 0) {
        const events = await getBookmarkedEvents(bookmarks);
        setBookmarkedEvents(events);
      }
    };

    fetchBookmarkedEvents();
  }, [bookmarks]);

  const handleRemoveBookmark = (eventId: string) => {
    setBookmarkedEvents(prev => prev.filter(event => event.id !== eventId));
  };

  if (userLoading || countsLoading || bookmarksLoading)
    return <div>Loading...</div>;
  if (userError || countsError || bookmarksError)
    return <div>나중에 다시 시도 해주세요.</div>;
  if (!user) return <div>먼저 로그인해 주세요.</div>;

  return (
    <div>
      <ProfileInfo
        userId={user.uid}
        profileImgUrl={userInfo?.profileImgUrl || ''}
        nickname={userInfo?.nickname || ''}
        bio={userInfo?.bio || ''}
        followersCount={followCounts?.followersCount || 0}
        followingCount={followCounts?.followingCount || 0}
        isCurrentUser={true}
      />
      <div className="mt-8">
        <h2 className="text-2xl text-primary font-godob mb-4">찜 목록</h2>
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {bookmarkedEvents.map(event => (
            <BookmarkCard
              key={event.id}
              event={event}
              onRemove={handleRemoveBookmark}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
