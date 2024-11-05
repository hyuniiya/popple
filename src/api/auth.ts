import { db, auth } from './firebase';
import {
  AuthError,
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { SignUpData } from '@/types';

const Basic_Profile_img = '/src/assets/images/user_img.png';

export const signUp = async (formData: SignUpData): Promise<User> => {
  const { email, password, name, nickname, bio } = formData;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name,
      nickname,
      bio,
      profileImg: Basic_Profile_img,
      createdAt: new Date(),
      role: 'user',
    });

    return user;
  } catch (error: AuthError | any) {
    throw error;
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error('인증된 사용자를 찾을 수 없습니다.');
  }
  // 현재 비밀번호 재인증
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // 새 비밀번호로 업데이트
  return updatePassword(user, newPassword);
};

export const deleteAccount = async (user: User) => {
  if (!user) return;
  try {
    await deleteUser(user);
    await deleteDoc(doc(db, 'users', user.uid));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const googleProvider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        nickname: user.displayName,
        bio: '',
        profileImg: user.photoURL || '/src/assets/images/user_img.png',
        createdAt: new Date(),
        role: 'user',
      });
    }

    return user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInWithGithub = async () => {
  const githubProvider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email || `${user.uid}@github.user`, // GitHub 이메일이 private일 경우 대체
        name: user.displayName || 'GitHub User',
        nickname: user.displayName || 'GitHub User',
        bio: '',
        profileImg: user.photoURL || '/src/assets/images/user_img.png',
        createdAt: new Date(),
        role: 'user',
        githubToken: token,
      });
    }

    return user;
  } catch (error: any) {
    console.error('Error signing in with GitHub:', error);
    throw error;
  }
};
