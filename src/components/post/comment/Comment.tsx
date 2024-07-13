import React, { useState } from 'react';
import { useCommentLike } from '@/hooks/useCommentLike';
import { FaHeart, FaRegHeart, FaRegFaceSmile } from 'react-icons/fa6';
import EmojiPicker from 'emoji-picker-react';

const Comment: React.FC<{
  comment: any;
  user: any;
  commentAuthor: any;
  formatDate: (date: any) => string;
  handleCommentUpdate: (id: string, text: string) => void;
  handleCommentDelete: (id: string) => void;
  isPostAuthor: boolean;
}> = ({
  comment,
  user,
  commentAuthor,
  formatDate,
  handleCommentUpdate,
  handleCommentDelete,
  isPostAuthor,
}) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { likesCount, isLiked, toggleLike } = useCommentLike(
    comment.id,
    user?.uid ?? null,
  );

  return (
    <div key={comment.id} className="flex items-start space-x-4 mb-4">
      <div className="flex flex-col items-center">
        <img
          src={commentAuthor?.profileImgUrl}
          alt={`${commentAuthor?.nickname}'s profile`}
          className="w-10 h-10 rounded-full mb-1"
        />
        <span className="text-xs">{commentAuthor?.nickname}</span>
      </div>
      <div className="flex-grow">
        <div className="bg-gray-100 rounded-lg p-3 relative">
          <div className="absolute left-[-8px] top-3 w-0 h-0 border-t-8 border-r-8 border-b-8 border-l-0 border-transparent border-r-gray-100"></div>
          {editingCommentId === comment.id ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleCommentUpdate(comment.id, editCommentText);
                setEditingCommentId(null);
              }}
              className="mb-4"
            >
              <div className="flex items-center px-2 border rounded-full shadow-drop bg-white">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-foreground"
                >
                  <FaRegFaceSmile />
                </button>
                <input
                  type="text"
                  value={editCommentText}
                  onChange={e => setEditCommentText(e.target.value)}
                  placeholder="댓글을 수정하세요..."
                  className="flex-grow p-2 border-none focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="text-[12px] px-6 py-1 bg-primary text-white rounded-full"
                >
                  수정
                </button>
              </div>
              {showEmojiPicker && (
                <div className="mt-2">
                  <EmojiPicker
                    onEmojiClick={emojiObject =>
                      setEditCommentText(prev => prev + emojiObject.emoji)
                    }
                  />
                </div>
              )}
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <p className="flex-grow">{comment.text}</p>
                <button
                  onClick={toggleLike}
                  className="text-popover text-xs flex items-center ml-2"
                >
                  {isLiked ? (
                    <FaHeart className="mr-1" />
                  ) : (
                    <FaRegHeart className="mr-1" />
                  )}
                  <span>{likesCount}</span>
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <small className="text-popover">
                  {formatDate(comment.createdAt)}
                </small>
                <div className="flex items-center space-x-2">
                  {user?.uid === comment.userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditCommentText(comment.text);
                        }}
                        className="text-popover text-xs"
                      >
                        수정
                      </button>
                      <span className="text-popover text-xs">|</span>
                    </>
                  )}
                  {(user?.uid === comment.userId || isPostAuthor) && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm('정말로 이 댓글을 삭제하시겠습니까?')
                        ) {
                          handleCommentDelete(comment.id);
                        }
                      }}
                      className="text-popover text-xs"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
