// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDV06mGxpbIbkq1DZY7nu5VMuq4ISJ6teU',
  authDomain: 'popple-81c83.firebaseapp.com',
  projectId: 'popple-81c83',
  storageBucket: 'popple-81c83.appspot.com',
  messagingSenderId: '1021626362221',
  appId: '1:1021626362221:web:ba31eae22615e4ae98d264',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
