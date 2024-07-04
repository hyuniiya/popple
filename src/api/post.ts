import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { Posts } from '@/types';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const fetchPosts = async (lastPost?: QueryDocumentSnapshot) => {
  let postsQuery = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(4),
  );

  if (lastPost) {
    postsQuery = query(postsQuery, startAfter(lastPost));
  }

  const snapshot = await getDocs(postsQuery);
  const posts = snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() }) as unknown as Posts,
  );

  return {
    posts,
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
  };
};

export const addPost = async (
  posts: Omit<Posts, 'id' | 'createdAt'> & { images?: File[] },
) => {
  try {
    let imageUrls: string[] = [];

    if (posts.images && posts.images.length > 0) {
      const uploadPromises = posts.images.map(async image => {
        const storageRef = ref(
          storage,
          `postImages/${Date.now()}_${image.name}`,
        );
        await uploadBytes(storageRef, image);
        return getDownloadURL(storageRef);
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    const { images, ...postData } = posts;

    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      imageUrls,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding post: ', error);
    throw error;
  }
};
