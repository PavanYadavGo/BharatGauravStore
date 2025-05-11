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
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const googleSignIn = async (): Promise<UserCredential> => {
    setAuthLoading(true);
    try {
      return await signInWithPopup(auth, googleProvider);
    } finally {
      setAuthLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
    setAuthLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setAuthLoading(false);
    }
  };

  const logOut = () => {
    return signOut(auth);
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
    <AuthContext.Provider
      value={{ user, loading, googleSignIn, signUpWithEmail, logOut, loginWithGoogle, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
