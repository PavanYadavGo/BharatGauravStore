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
    street: '',
    city: '',
    state: '',
    country: '',
    zip: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Auto-fill address fields based on zip
  useEffect(() => {
    const fetchAddress = async () => {
      if (/^\d{6}$/.test(form.zip)) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${form.zip}`);
          const data = await res.json();
          const postOffice = data[0]?.PostOffice?.[0];

          if (postOffice) {
            setForm((prev) => ({
              ...prev,
              city: postOffice.District || '',
              state: postOffice.State || '',
              country: postOffice.Country || '',
            }));
            setError('');
          } else {
            setError('Invalid PIN code');
          }
        } catch {
          setError('Failed to fetch address from PIN code');
        }
      }
    };

    fetchAddress();
  }, [form.zip]);

  const handleGoogleSignup = async () => {
    try {
      const result = await googleSignIn();
      const uid = result.user.uid;

      await setDoc(
        doc(db, 'users', uid),
        {
          fullName: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          country: '',
          zip: '',
          email: result.user.email,
        },
        { merge: true }
      );

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailSignup = async () => {
    const { email, password, fullName, phone, street, city, state, country, zip } = form;

    if (!fullName || !phone || !street || !city || !state || !country || !zip || !email || !password) {
      return setError('Please fill all fields');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const zipRegex = /^\d{6}$/;

    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address');
    }

    if (!phoneRegex.test(phone)) {
      return setError('Phone number must be 10 digits');
    }

    if (!zipRegex.test(zip)) {
      return setError('ZIP code must be 6 digits');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      const result = await signUpWithEmail(email, password);
      const uid = result.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        fullName,
        phone,
        street,
        city,
        state,
        country,
        zip,
      });

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'zip') {
      value = value.replace(/\D/g, '').slice(0, 6);
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardContent>
          <h2 className="text-2xl font-semibold text-center mb-6">Create an account</h2>
          {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

          {[
            { name: 'fullName', placeholder: 'Full Name' },
            { name: 'phone', placeholder: 'Phone Number' },
            { name: 'street', placeholder: 'Street Address' },
            { name: 'zip', placeholder: 'PIN Code' },
            { name: 'city', placeholder: 'City' },
            { name: 'state', placeholder: 'State' },
            { name: 'country', placeholder: 'Country' },
            { name: 'email', placeholder: 'Email Address' },
            { name: 'password', placeholder: 'Password' },
          ].map(({ name, placeholder }) => (
            <div className="mb-4" key={name}>
              <Input
                type={name === 'password' ? 'password' : 'text'}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={(e) => handleChange(name, e.target.value)}
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
