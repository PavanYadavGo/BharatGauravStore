'use client';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useEffect, useState, useContext } from 'react';
import { auth, db } from '../../helpers/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch Firestore document for the logged-in user
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data(); // contains username, address, etc.
            setUser({
              uid: user.uid,
              email: user.email,
              username: userData.username,
              photoURL: user.photoURL || null,
            });
          } else {
            // No document found, fallback to basic auth data
            setUser({
              uid: user.uid,
              email: user.email,
              photoURL: user.photoURL || null,
            });
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
