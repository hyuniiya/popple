import { db, storage } from '@/api/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EventData } from '@/types';

export const addEvent = async (eventData: EventData) => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    let newId = querySnapshot.size;

    let imageUrl = '';
    if (eventData.image) {
      const imageName = `${Date.now()}_${eventData.image.name}`;
      const imageRef = ref(storage, `events/${imageName}`);
      const uploadResult = await uploadBytes(imageRef, eventData.image);
      console.log('Upload result:', uploadResult);
      imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL:', imageUrl);
    } else {
      console.log('No image to upload');
    }

    const { image, ...dataToSave } = eventData;
    const newDocRef = doc(eventsRef);
    await setDoc(newDocRef, {
      ...dataToSave,
      id: newId.toString(),
      imageUrl,
      startDate: dataToSave.startDate,
      endDate: dataToSave.endDate,
      createdAt: serverTimestamp(),
    });

    return newDocRef.id;
  } catch (error) {
    console.error('Error in addEvent:', error);
    throw error;
  }
};

export const fetchEvents = async (): Promise<EventData[]> => {
  const eventsCollection = collection(db, 'events');
  const eventsSnapshot = await getDocs(eventsCollection);
  return eventsSnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() }) as EventData,
  );
};
