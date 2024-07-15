import { useMutation, useQueryClient } from 'react-query';
import { addPost } from '@/api/post';
import { Posts } from '@/types';
import imageCompression from 'browser-image-compression';

export const useAddPost = () => {
  const queryClient = useQueryClient();

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  };

  return useMutation(
    async (newPost: Omit<Posts, 'id' | 'createdAt'> & { images?: File[] }) => {
      if (newPost.images) {
        const compressedImages = await Promise.all(
          newPost.images.map(compressImage),
        );
        newPost.images = compressedImages;
      }
      return addPost(newPost);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
      },
    },
  );
};
