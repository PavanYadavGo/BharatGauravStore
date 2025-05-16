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
    <main className="min-h-screen overflow-x-hidden bg-gray-100 dark:bg-gray-900 py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Preview */}
        <div className="rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order Preview</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
{cart.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                  {/* Increased width and height for better visibility */}
                  <div className="w-24 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src={item.images?.[0] || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-gray-800 dark:text-white font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                </div>
                </div>
              ))}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Total:</span>
                  <span className="text-green-600 font-bold text-lg">₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Checkout Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="buyerName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="buyerName"
                name="buyerName"
                placeholder="Your Full Name"
                value={form.buyerName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="buyerEmail" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="buyerEmail"
                name="buyerEmail"
                value={form.buyerEmail}
                disabled
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                placeholder="Your Contact Number"
                value={form.contactNumber}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Shipping Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Your Shipping Address"
                value={form.address}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                placeholder="Your ZIP Code"
                value={form.zipCode}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="paymentMethod" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="online">Razorpay</option>
              </select>
            </div>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={recaptchaRef}
              onChange={handleRecaptchaChange}
              className="mt-4"
            />
            <button
              onClick={handleConfirmPurchase}
              disabled={loading || !captchaVerified}
              className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-md shadow-md hover:shadow-lg transition duration-300 mt-4 ${
                loading || !captchaVerified ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RazorpayCheckout;