import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchPostById } from '@/api/post';
import { useUpdatePost } from '@/hooks/useUpdatePost';
import { Posts } from '@/types';
import { FiPlusCircle, FiX } from 'react-icons/fi';
import PostBtn from '@/components/button/PostBtn';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updatePostMutation = useUpdatePost(id as string);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery(['post', id], () => fetchPostById(id as string), {
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags || []);
      setExistingImages(post.imageUrls || []);
    }
  }, [post]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading post</div>;

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags(prevTags => [...prevTags, tag.trim()]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (newImages.length + existingImages.length + files.length > 4) {
        alert(`최대 ${4}개의 이미지만 추가할 수 있습니다.`);
        return;
      }
      const newImageFiles = Array.from(files).slice(
        0,
        4 - newImages.length - existingImages.length,
      );
      setNewImages(prevImages => [...prevImages, ...newImageFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
    } else {
      setNewImages(prevImages => prevImages.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData: Partial<Posts> & {
        newImages?: File[];
        removedImages?: string[];
      } = {
        title,
        content,
        tags,
        newImages: newImages.length > 0 ? newImages : undefined,
        removedImages: post?.imageUrls
          ? post.imageUrls.filter(url => !existingImages.includes(url))
          : undefined,
        imageUrls: existingImages,
      };

      await updatePostMutation.mutateAsync(postData);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl py-4">
      <h1 className="text-primary text-[22px] font-godob mb-6">게시글 수정</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full p-2 mb-4 border border-popover rounded focus:outline-none"
        />

        <div className="relative mb-4 border border-popover rounded">
          <button
            type="button"
            className="p-1 rounded"
            onClick={handleImageUpload}
          >
            <FiPlusCircle className="text-popover text-[24px]" />
          </button>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            className="w-full p-2 h-40 focus:outline-none"
          />

          <div className="absolute flex-col bottom-2 left-2 flex items-center">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tag}
              onChange={e => setTag(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="#태그 입력"
              className="p-1 text-sm focus:outline-none rounded mr-2"
            />
          </div>
        </div>

        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative">
                <img
                  src={image}
                  alt={`Existing ${index}`}
                  className="w-20 h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, true)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <FiX />
                </button>
              </div>
            ))}
            {newImages.map((image, index) => (
              <div key={`new-${index}`} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New ${index}`}
                  className="w-20 h-20 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, false)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <PostBtn variant="secondary" onClick={() => navigate(-1)}>
            취소
          </PostBtn>
          <PostBtn type="submit">수정</PostBtn>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
