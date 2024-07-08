import { useMutation, useQueryClient } from 'react-query';
import { deletePost } from '@/api/post';
import { useNavigate } from 'react-router-dom';

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      navigate('/');
    },
    onError: error => {
      console.error('Error deleting post:', error);
    },
  });
};
