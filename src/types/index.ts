import { UseFormRegister } from 'react-hook-form';

export interface FollowData {
  uid: string;
  profileImage?: string;
  nickname: string;
  bio?: string;
}

export interface UserData {
  uid: string;
  email?: string;
  profileImgUrl?: string;
  nickname?: string;
  bio?: string;
}

export interface InputProps {
  id: string;
  label: string;
  type?: string;
  error?: string;
  placeholder?: string;
  register: UseFormRegister<SignUpData>;
}

export interface SignUpData {
  profileImg: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
  bio: string;
}
