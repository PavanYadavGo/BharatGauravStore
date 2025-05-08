'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../../helpers/firebaseConfig';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

// Declare the Razorpay global type
declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCheckout = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    buyerEmail: '',
    buyerName: '',
    contactNumber: '',
    address: '',
    zipCode: '',
    paymentMethod: 'cod', // Default to COD
  });
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Failed to load Razorpay script.');
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
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
            const data = docSnap.data();
            setForm((prev) => ({
              ...prev,
              buyerEmail: data.email || '',
              buyerName: data.username || '',
              contactNumber: data.phone || '',
              address: data.address || '',
              zipCode: data.zip || '',
            }));
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
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'contactNumber' ? value.replace(/\D/g, '') : value,
    }));
  };

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token);
  };

  const placeOrder = async (paymentStatus = 'Pending', paymentId = '') => {
    try {
      setLoading(true);
      const orderData = {
        userId: user?.uid,
        email: form.buyerEmail,
        name: form.buyerName,
        contact: form.contactNumber,
        address: form.address,
        zip: form.zipCode,
        paymentMethod: form.paymentMethod,
        paymentStatus,
        paymentId,
        items: cart,
        total: getTotalPrice(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: { ...orderData, id: docRef.id } }),
      });

      toast.success('Order placed successfully!');
      clearCart();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/');
      }, 4000);
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async () => {
    if (!captchaVerified) return toast.error('Please complete the reCAPTCHA.');
    if (!user) return toast.error('You must be logged in to place an order.');
    if (cart.length === 0) return toast.error('Your cart is empty.');
    if (!scriptLoaded) return toast.error('Razorpay script not loaded.');
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) return toast.error('Razorpay configuration missing.');
    if (!window.Razorpay) return toast.error('Razorpay SDK not available.');

    try {
      setLoading(true);
      const totalAmount = getTotalPrice();
      if (totalAmount <= 0) throw new Error('Invalid order amount.');

      const res = await fetch('/api/razorpay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, userId: user?.uid }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Razorpay API response:', res.status, text);
        throw new Error(`Server responded with status ${res.status}: ${text}`);
      }

      const data = await res.json();

      if (!data.success || !data.order) {
        console.error('Razorpay API error:', data);
        throw new Error(data.error || 'Failed to initiate Razorpay order.');
      }

      const { id: order_id, amount } = data.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'E-Commerce Store',
        description: 'Purchase from E-Commerce Store',
        order_id: order_id,
        handler: async (response: any) => {
          if (response.razorpay_payment_id) {
            await placeOrder('Success', response.razorpay_payment_id);
            toast.success('Payment successful!');
          } else {
            await placeOrder('Failed');
            toast.error('Payment failed!');
          }
        },
        prefill: {
          name: form.buyerName,
          email: form.buyerEmail,
          contact: form.contactNumber,
        },
        notes: {
          address: form.address,
          zipCode: form.zipCode,
        },
        theme: {
          color: '#F37A20',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        console.error('Razorpay payment failed:', response.error);
        toast.error('Payment failed: ' + (response.error.description || 'Unknown error'));
        placeOrder('Failed');
      });
      rzp.open();
    } catch (error: any) {
      console.error('Razorpay error:', error);
      toast.error('Failed to initiate Razorpay payment: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!form.buyerName || !form.buyerEmail || !form.contactNumber || !form.address || !form.zipCode) {
      return toast.error('Please fill all required fields.');
    }
    if (form.paymentMethod === 'cod') {
      await placeOrder('Pending', 'COD');
    } else {
      await initiateRazorpayPayment();
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#f4f7fa] to-[#dceefb] dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-20">
        {/* Cart Summary */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">🛒 Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
              {cart.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
                  <img
                    src={item.images?.[0] || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-full sm:w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">₹{item.price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Checkout</h2>
            <div className="grid gap-4">
              <input
                type="text"
                name="buyerName"
                placeholder="Full Name"
                value={form.buyerName}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="email"
                name="buyerEmail"
                value={form.buyerEmail}
                disabled
                className="input-style bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                value={form.contactNumber}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="input-style"
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={form.zipCode}
                onChange={handleChange}
                className="input-style"
              />
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="input-style"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="online">Razorpay</option>
              </select>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                ref={recaptchaRef}
                onChange={handleRecaptchaChange}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-xl font-semibold text-green-600">Total: ₹{getTotalPrice()}</span>
            <button
              onClick={handleConfirmPurchase}
              disabled={loading}
              className={`w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RazorpayCheckout;