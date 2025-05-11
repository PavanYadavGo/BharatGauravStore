'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../helpers/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google');
      router.push('/');
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-6">Login to your account</h2>

          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full mb-4" onClick={handleLogin}>
            Login
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={20} />
            Sign in with Google
          </Button>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
