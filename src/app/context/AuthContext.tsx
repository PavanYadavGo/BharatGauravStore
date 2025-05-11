'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  googleSignIn: () => Promise<UserCredential>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider); // returns Promise<UserCredential>
  };

  const signUpWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password); // returns Promise<UserCredential>
  };

  const logOut = () => {
    return signOut(auth); // returns Promise<void>
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, googleSignIn, signUpWithEmail, logOut, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
