import { db } from './firebase';
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import { EventData } from '@/types';

export const addBookmark = async (userId: string, eventId: string) => {
  const bookmarkRef = doc(db, 'bookmarks', `${userId}_${eventId}`);
  await setDoc(bookmarkRef, { userId, eventId });
};

export const removeBookmark = async (userId: string, eventId: string) => {
  const bookmarkRef = doc(db, 'bookmarks', `${userId}_${eventId}`);
  await deleteDoc(bookmarkRef);
};

export const checkIsBookmarked = async (userId: string, eventId: string) => {
  const bookmarkRef = doc(db, 'bookmarks', `${userId}_${eventId}`);
  const docSnap = await getDoc(bookmarkRef);
  return docSnap.exists();
};

export const getBookmarkedEvents = async (
  eventIds: string[],
): Promise<EventData[]> => {
  const q = query(collection(db, 'events'), where('id', 'in', eventIds));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() }) as EventData,
  );
};
