import { useMutation, useQueryClient } from 'react-query';
import { updatePost } from '@/api/post';
import { useNavigate } from 'react-router-dom';
import { Posts } from '@/types';

export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(
    (
      postData: Partial<Posts> & {
        newImages?: File[];
        removedImages?: string[];
      },
    ) => updatePost(id, postData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['post', id]);
        queryClient.invalidateQueries('posts');
        navigate(`/posts/${id}`);
      },
      onError: error => {
        console.error('Error updating post:', error);
      },
    },
  );
};
