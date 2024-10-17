import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/api/firebase';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user && user.email) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setIsAdmin(userDoc.data().role === 'admin');
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };
    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};
