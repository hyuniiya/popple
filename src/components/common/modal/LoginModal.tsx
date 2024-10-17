import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">로그인 필요</h2>
        <p className="mb-4">로그인 창으로 이동하시겠습니까?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
