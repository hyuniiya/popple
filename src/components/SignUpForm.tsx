import { useState } from 'react';
import { auth } from '@/api/firebase';
import { AuthError, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully!');
    } catch (error: AuthError | any) {
      if (error.code === 'auth/email-already-in-use') {
        console.error('Error signing up: 이미 가입된 이메일입니다.');
      } else {
        console.error('Error signing up:', error.message);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSignUp(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
