import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserData } from '@/types';

export async function getAllUsers(): Promise<UserData[]> {
  const userSnapshot = await getDocs(collection(db, 'users'));
  return userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

export const followUser = async (
  from_uid: string,
  to_uid: string,
): Promise<string> => {
  const isFollowing = await checkIfFollowing(from_uid, to_uid);
  if (isFollowing) {
    throw new Error('이미 팔로잉한 회원입니다.');
  }

  const docRef = await addDoc(collection(db, 'follows'), {
    from_uid,
    to_uid,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const unfollowUser = async (
  from_uid: string,
  to_uid: string,
): Promise<void> => {
  const q = query(
    collection(db, 'follows'),
    where('from_uid', '==', from_uid),
    where('to_uid', '==', to_uid),
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    deleteDoc(doc.ref);
  });
};

export const checkIfFollowing = async (
  from_uid: string,
  to_uid: string,
): Promise<boolean> => {
  const q = query(
    collection(db, 'follows'),
    where('from_uid', '==', from_uid),
    where('to_uid', '==', to_uid),
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};
