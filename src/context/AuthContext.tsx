import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@/api/firebase';
import { useUserStore } from '@/store/index';

export const AuthContext = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    useUserStore.getState().setUser(user);
    return user;
  } catch (error) {
    console.error('Error signing up: ', error);
    return null;
  }
};
