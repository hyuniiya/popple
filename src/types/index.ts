import { UseFormRegister } from 'react-hook-form';

export interface SignUpData {
  image: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
  bio: string;
}

export interface InputProps {
  id: string;
  label: string;
  type?: string;
  error?: string;
  placeholder?: string;
  register: UseFormRegister<SignUpData>;
}
