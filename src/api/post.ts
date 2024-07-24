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
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { Posts } from '@/types';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

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

export const fetchPostById = async (id: string) => {
  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Posts;
  } else {
    throw new Error('Post not found');
  }
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

export const deletePost = async (id: string) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', id));
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const postData = postDoc.data();

    if (postData.imageUrls && postData.imageUrls.length > 0) {
      const deletePromises = postData.imageUrls.map(async (url: string) => {
        const imageRef = ref(storage, url);
        try {
          await deleteObject(imageRef);
        } catch (error) {
          console.warn(`Failed to delete image: ${url}`, error);
        }
      });

      await Promise.all(deletePromises);
    }

    await deleteDoc(doc(db, 'posts', id));
  } catch (error) {
    console.error('Error deleting post: ', error);
    throw error;
  }
};

export const updatePost = async (
  id: string,
  postData: Partial<Posts> & { newImages?: File[]; removedImages?: string[] },
) => {
  const postRef = doc(db, 'posts', id);
  const postSnap = await getDoc(postRef);
  const currentPost = postSnap.data() as Posts;

  let updateData: any = { ...postData };
  let currentImageUrls = currentPost.imageUrls || [];

  if (postData.removedImages && postData.removedImages.length > 0) {
    const deletePromises = postData.removedImages.map(async url => {
      const imageRef = ref(storage, url);
      return deleteObject(imageRef);
    });
    await Promise.all(deletePromises);

    currentImageUrls = currentImageUrls.filter(
      url => !postData.removedImages?.includes(url),
    );
  }

  if (postData.newImages && postData.newImages.length > 0) {
    const uploadPromises = postData.newImages.map(async image => {
      const storageRef = ref(
        storage,
        `posts/${id}/${Date.now()}_${image.name}`,
      );
      await uploadBytes(storageRef, image);
      return getDownloadURL(storageRef);
    });

    const newImageUrls = await Promise.all(uploadPromises);
    currentImageUrls = [...currentImageUrls, ...newImageUrls];
  }

  updateData.imageUrls = currentImageUrls;

  delete updateData.newImages;
  delete updateData.removedImages;

  await updateDoc(postRef, updateData);
};

export const toggleLike = async (postId: string, userId: string) => {
  const likesRef = collection(db, 'like_posts');
  const q = query(
    likesRef,
    where('postId', '==', postId),
    where('userId', '==', userId),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    await addDoc(likesRef, {
      userId,
      postId,
      createdAt: serverTimestamp(),
    });
  } else {
    const likeDoc = querySnapshot.docs[0];
    await deleteDoc(likeDoc.ref);
  }
};

export const getLikesCount = async (postId: string) => {
  const likesRef = collection(db, 'like_posts');
  const q = query(likesRef, where('postId', '==', postId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

export const isLikedByUser = async (postId: string, userId: string) => {
  const likesRef = collection(db, 'like_posts');
  const q = query(
    likesRef,
    where('postId', '==', postId),
    where('userId', '==', userId),
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const fetchPostsByEventId = async (
  eventId: string,
): Promise<Posts[]> => {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef,
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc'),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() }) as Posts,
  );
};
