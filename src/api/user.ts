import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserData } from '@/types';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export async function getAllUsers(): Promise<UserData[]> {
  const userSnapshot = await getDocs(collection(db, 'users'));
  return userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

export async function getUserInfo(userId: string): Promise<UserData | null> {
  const allUsers = await getAllUsers();
  return allUsers.find(user => user.uid === userId) || null;
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

export const getFollowersCount = async (uid: string): Promise<number> => {
  const followersQuery = query(
    collection(db, 'follows'),
    where('to_uid', '==', uid),
  );
  const followersSnapshot = await getDocs(followersQuery);
  return followersSnapshot.size;
};

export const getFollowingCount = async (uid: string): Promise<number> => {
  const followingQuery = query(
    collection(db, 'follows'),
    where('from_uid', '==', uid),
  );
  const followingSnapshot = await getDocs(followingQuery);
  return followingSnapshot.size;
};

export const updateUserProfile = async (uid: string, updateData: any) => {
  const userRef = doc(db, 'users', uid);
  const storage = getStorage();

  if (updateData.profileImg) {
    const file = updateData.profileImg as File;
    const storageRef = ref(storage, `profileImages/${uid}`);

    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    updateData.profileImgUrl = downloadURL;

    delete updateData.profileImg;
  }

  await updateDoc(userRef, updateData);

  return updateData;
};
