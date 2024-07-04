import { useMutation, useQueryClient } from 'react-query';
import { addPost } from '@/api/post';
import { Posts } from '@/types';

export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (newPost: Omit<Posts, 'id' | 'createdAt'> & { images?: File[] }) =>
      addPost(newPost),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
      },
    },
  );
};
