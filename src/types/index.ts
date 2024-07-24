import { ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';

export interface EventData {
  longitude: any;
  latitude: any;
  id: string;
  type: 'popup' | 'exhibition';
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  operatingHours: string;
  image: File | null;
  imageUrl?: string;
}

export interface Posts {
  eventId?: string;
  Image?: any;
  region?: ReactNode;
  authorNickname?: ReactNode;
  likes?: ReactNode;
  isOngoing?: any;
  exhibitionImage?: string;
  id: string;
  title: string;
  content: string;
  tags?: string[];
  userId: string;
  imageUrl?: string;
  imageUrls?: string[];
  createdAt: Date;
}

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
