import { db, storage } from '@/api/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface EventData {
  type: 'popup' | 'exhibition';
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  operatingHours: string;
  image: File | null;
}

export const addEvent = async (eventData: EventData) => {
  try {
    let imageUrl = '';
    if (eventData.image) {
      const imageName = `${Date.now()}_${eventData.image.name}`;
      const imageRef = ref(storage, `events/${imageName}`);
      await uploadBytes(imageRef, eventData.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const { image, ...dataToSave } = eventData;

    const docRef = await addDoc(collection(db, 'events'), {
      ...dataToSave,
      imageUrl,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error in addEvent:', error);
    throw error;
  }
};
