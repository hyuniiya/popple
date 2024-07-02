import { db, auth } from './firebase';
import {
  AuthError,
  User,
  createUserWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
    });

    return user;
  } catch (error: AuthError | any) {
    throw error;
  }
};

export const changePassword = async (newPassword: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('인증된 사용자를 찾을 수 없습니다.');
  }
  await updatePassword(user, newPassword);
};
