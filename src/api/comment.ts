import { db } from './firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  getCountFromServer,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';

export const fetchComments = async (
  postId: string,
  cursor: QueryDocumentSnapshot<DocumentData> | null = null,
): Promise<{
  comments: Array<{
    id: string;
    postId: string;
    userId: string;
    text: string;
    createdAt: Timestamp;
  }>;
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  totalCount: number;
}> => {
  const commentsRef = collection(db, 'comments');
  let q = query(
    commentsRef,
    where('postId', '==', postId),
    orderBy('createdAt', 'desc'),
    limit(3),
  );

  if (cursor) {
    q = query(q, startAfter(cursor));
  }

  const snapshot = await getDocs(q);
  const comments = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as {
      postId: string;
      userId: string;
      text: string;
      createdAt: Timestamp;
    }),
  }));

  return {
    comments,
    nextCursor: snapshot.docs[snapshot.docs.length - 1] || null,
    totalCount: snapshot.size,
  };
};

export const createComment = async (
  postId: string,
  userId: string,
  text: string,
): Promise<void> => {
  const commentsRef = collection(db, 'comments');
  await addDoc(commentsRef, {
    postId,
    userId,
    text,
    createdAt: serverTimestamp(),
  });
};

export const getCommentsCount = async (postId: string): Promise<number> => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, where('postId', '==', postId));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const updateComment = async (commentId: string, text: string) => {
  const commentRef = doc(db, 'comments', commentId);
  await updateDoc(commentRef, { text });
};

export const deleteComment = async (commentId: string) => {
  const commentRef = doc(db, 'comments', commentId);
  await deleteDoc(commentRef);
};

export const toggleCommentLike = async (
  commentId: string,
  userId: string,
): Promise<void> => {
  const likesRef = collection(db, 'comment_likes');
  const q = query(
    likesRef,
    where('commentId', '==', commentId),
    where('userId', '==', userId),
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    await addDoc(likesRef, {
      userId,
      commentId,
      createdAt: serverTimestamp(),
    });
  } else {
    const likeDoc = querySnapshot.docs[0];
    await deleteDoc(likeDoc.ref);
  }
};

export const getCommentLikesCount = async (commentId: string) => {
  const likesRef = collection(db, 'comment_likes');
  const q = query(likesRef, where('commentId', '==', commentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

export const isCommentLikedByUser = async (
  commentId: string,
  userId: string,
) => {
  const likesRef = collection(db, 'comment_likes');
  const q = query(
    likesRef,
    where('commentId', '==', commentId),
    where('userId', '==', userId),
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};
