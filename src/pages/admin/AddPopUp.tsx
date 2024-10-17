import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { addEvent } from '@/api/info';
import imageCompression from 'browser-image-compression';

const AddPopup: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'popup' as 'popup' | 'exhibition',
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    category: '',
    operatingHours: '',
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        navigate('/');
      } else {
        setLoading(false);
      }
    }
  }, [isAdmin, adminLoading, navigate]);

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 3,
      maxWidthOrHeight: 3000,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const compressedImage = await compressImage(file);
      setImage(compressedImage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      console.error('No image selected');
      return;
    }
    try {
      await addEvent({
        ...formData,
        image,
        id: '',
        location: {
          latitude: '',
          longitude: '',
        },
        title: undefined,
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding popup:', error);
    }
  };

  if (loading || adminLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-primary font-godob text-2xl font-bold mb-4">
        {formData.type === 'popup' ? '팝업 스토어' : '전시회'} 추가하기
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="popup">팝업 스토어</option>
          <option value="exhibition">전시회</option>
        </select>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex space-x-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows={4}
          required
        ></textarea>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="fashion">Fashion</option>
          <option value="art">Art</option>
        </select>
        <input
          type="text"
          name="operatingHours"
          value={formData.operatingHours}
          onChange={handleChange}
          placeholder="Operating Hours"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-primary font-godob text-white p-2 rounded"
        >
          추가하기
        </button>
      </form>
    </div>
  );
};

export default AddPopup;
