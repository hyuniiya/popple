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
    if (eventData.image && eventData.image instanceof File) {
      const imageName = `${Date.now()}_${eventData.image.name}`;
      const imageRef = ref(storage, `events/${imageName}`);
      await uploadBytes(imageRef, eventData.image);
      imageUrl = await getDownloadURL(imageRef);
    } else if (typeof eventData.image === 'string') {
      imageUrl = eventData.image;
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
