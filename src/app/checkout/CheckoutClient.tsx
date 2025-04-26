'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../../helpers/firebaseConfig';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

export default function CheckoutPage() {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.error('Please log in to checkout.');
      router.push('/login');
    } else {
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setBuyerEmail(userData.email || '');
            setBuyerName(userData.username || '');
            setContactNumber(userData.phone || '');
            setAddress(userData.address || '');
            setZipCode(userData.zip || '');
          } else {
            toast('User profile incomplete. Please fill all fields.', { icon: '⚠️' });
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
          toast.error('Failed to fetch user data');
        }
      };
      fetchUserData();
    }
  }, [user, authLoading]);

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token);
  };

  const placeOrder = async (paymentStatus = 'Pending', paymentId = '') => {
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user?.uid,
        email: buyerEmail,
        name: buyerName,
        contact: contactNumber,
        address,
        zip: zipCode,
        paymentMethod,
        paymentStatus,
        paymentId,
        items: cart,
        total: getTotalPrice(),
        createdAt: serverTimestamp(),
      });

      toast.success('Order placed successfully!');
      clearCart();
      setTimeout(() => router.push('/'), 1500);
    } catch (error) {
      console.error('Checkout Error:', error);
      toast.error('Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    if (loading) return;
  
    if (!captchaVerified) {
      toast.error('Please verify reCAPTCHA!');
      return;
    }
  
    if (!buyerEmail || !buyerName || !contactNumber || !address || !zipCode) {
      toast.error('Please fill all fields!');
      return;
    }
  
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
  
    setLoading(true);
  
    if (paymentMethod === 'cod') {
      await placeOrder('Pending', '');
    } else {
      const razorpayKey = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_LIVE
        : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_TEST;
  
      const options = {
        key: razorpayKey,
        amount: getTotalPrice() * 100,
        currency: 'INR',
        name: 'Bharat Gaurav Store',
        description: 'Order Payment',
        handler: async function (response: any) {
          console.log('✅ Payment Success Response:', response);
          await placeOrder('Paid', response.razorpay_payment_id);
        },
        prefill: {
          name: buyerName,
          email: buyerEmail,
          contact: contactNumber,
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment was cancelled.');
            setLoading(false);
          },
        },
      };
  
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };
}
