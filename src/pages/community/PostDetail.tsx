import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchPostById } from '@/api/post';
import { getAllUsers } from '@/api/user';
import { Posts, UserData } from '@/types';
import { FaHeart, FaRegComment, FaRegHeart } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';
import { useDeletePost } from '@/hooks/useDeletePost';
import { Link } from 'react-router-dom';
import { useLikePost } from '@/hooks/useLikePost';
import { getLikesCount, isLikedByUser } from '@/api/post';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const deletePostMutation = useDeletePost();
  const likePostMutation = useLikePost(id ?? '');

  const { data: post, isLoading: postLoading } = useQuery<Posts, Error>(
    ['post', id],
    () => fetchPostById(id as string),
    { enabled: !!id },
  );

  const { data: users, isLoading: usersLoading } = useQuery<UserData[], Error>(
    'users',
    getAllUsers,
  );

  const { data: likesCount = 0 } = useQuery(
    ['likes', id],
    () => (id ? getLikesCount(id) : Promise.resolve(0)),
    { enabled: !!id },
  );

  const { data: isLiked = false } = useQuery(
    ['isLiked', id, user?.uid],
    () =>
      id && user?.uid ? isLikedByUser(id, user.uid) : Promise.resolve(false),
    { enabled: !!id && !!user },
  );

  if (postLoading || usersLoading) return <div>Loading...</div>;
  if (!post || !users) return <div>Post or Users not found</div>;

  const author = users.find(user => user.uid === post.userId);

  const handleLike = () => {
    if (user) {
      likePostMutation.mutate(user.uid);
    } else {
      alert('로그인이 필요합니다.');
    }
  };

  if (!author) return <div>Author not found</div>;

  const formatDate = (date: any) => {
    if (!date) return 'Invalid Date';
    const parsedDate = date.toDate ? date.toDate() : new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid Date';
    return parsedDate
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\.$/, '')
      .replace(/ /g, '');
  };

  const isAuthor = user && user.uid === post.userId;

  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deletePostMutation.mutate(id as string);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">{post.title}</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img
            src={author.profileImgUrl}
            alt={`${author.nickname}'s profile`}
            className="w-10 h-10 rounded-full mr-3 shadow-drop"
          />
          <div className="flex flex-col">
            <span className="text-xs mr-3">{author.nickname}</span>
            <span className="text-[10px] text-popover">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-popover text-xs mb-2">
            <FaRegComment />
            <span>comments.count</span>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/edit/${post.id}`}
                className="text-popover px-2 py-1 rounded text-xs"
              >
                수정
              </Link>
              <div className="mt-0.5 h-5 w-[0.5px] bg-popover"></div>
              <button
                className="text-popover px-2 py-1 rounded text-xs"
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      {Array.isArray(post.imageUrls) ? (
        post.imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Post image ${index + 1}`}
            className="mb-4"
          />
        ))
      ) : post.imageUrl ? (
        <img src={post.imageUrl} alt="Post image" className="mb-4" />
      ) : null}
      <p className="mb-4">{post.content}</p>
      <button
        onClick={handleLike}
        className="flex items-center mr-2 text-secondary-foreground"
      >
        {isLiked ? <FaHeart /> : <FaRegHeart />}
        <span className="ml-1">{likesCount}</span>
      </button>
    </div>
  );
};

export default PostDetail;
