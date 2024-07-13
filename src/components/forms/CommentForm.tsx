import React, { useState } from 'react';
import { FaRegFaceSmile } from 'react-icons/fa6';
import EmojiPicker from 'emoji-picker-react';

const CommentForm: React.FC<{
  user: any;
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  handleCommentSubmit: (userId: string) => void;
}> = ({ user, commentText, setCommentText, handleCommentSubmit }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiObject: any) => {
    setCommentText(prevText => prevText + emojiObject.emoji);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (user) handleCommentSubmit(user.uid);
      }}
      className="mb-4"
    >
      <div className="flex items-center px-2 border rounded-full shadow-drop">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-foreground"
        >
          <FaRegFaceSmile />
        </button>
        <input
          type="text"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="flex-grow p-2 border-none focus:outline-none"
        />
        <button
          type="submit"
          className="text-[12px] px-6 py-1 bg-primary text-white rounded-full"
        >
          등록
        </button>
      </div>
      {showEmojiPicker && (
        <div className="mt-2">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </form>
  );
};

export default CommentForm;
