import { db, auth } from './firebase';
import {
  AuthError,
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
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
