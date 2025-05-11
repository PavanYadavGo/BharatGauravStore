'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpPage() {
  const { googleSignIn, user, loading, signUpWithEmail } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    zip: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignup = async () => {
    try {
      const result = await googleSignIn();

      const uid = result.user.uid;

      await setDoc(
        doc(db, 'users', uid),
        {
          fullName: '',
          phone: '',
          address: '',
          zip: '',
          email: result.user.email,
        },
        { merge: true }
      );

      router.push('/profile');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailSignup = async () => {
    const { email, password, fullName, phone, address, zip } = form;
    if (!fullName || !phone || !address || !zip) {
      return setError('Please fill all fields');
    }

    try {
      const result = await signUpWithEmail(email, password);
      const uid = result.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        fullName,
        phone,
        address,
        zip,
      });

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-6">Create an account</h2>
          {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

          {['fullName', 'phone', 'address', 'zip', 'email', 'password'].map((field, i) => (
            <div className="mb-4" key={i}>
              <Input
                type={field === 'password' ? 'password' : 'text'}
                placeholder={field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}

          <Button className="w-full mb-4" onClick={handleEmailSignup}>
            Sign up with Email
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleSignup}
          >
            <FcGoogle size={20} />
            Sign up with Google
          </Button>

          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
