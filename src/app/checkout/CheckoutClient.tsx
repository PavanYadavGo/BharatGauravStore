'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../../helpers/firebaseConfig';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';

const PhonePeCheckout = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

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
  }, [user, authLoading, router]);

  const handleRecaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token);
  };

  const placeOrder = async (paymentStatus = 'Pending', paymentId = '') => {
    try {
      setLoading(true);
      const orderData = {
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
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: { ...orderData, id: docRef.id },
        }),
      });

      toast.success('Order placed successfully!');
      clearCart();
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        router.push('/');
      }, 4000);
    } catch (error) {
      console.error('Checkout Error:', error);
      toast.error('Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!captchaVerified) return toast.error('Please complete the reCAPTCHA.');
    if (!user) return toast.error('You must be logged in to place an order.');
    if (cart.length === 0) return toast.error('Your cart is empty.');

    if (paymentMethod === 'cod') {
      await placeOrder('Pending', 'COD');
    } else {
      try {
        setLoading(true);
        const res = await fetch("/api/phonepe/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: getTotalPrice(), userId: user?.uid }),
        });

        const data = await res.json();
        if (data.data?.instrumentResponse?.redirectInfo?.url) {
          window.location.href = data.data.instrumentResponse.redirectInfo.url;
        } else {
          console.error("Unexpected PhonePe response", data);
          toast.error('Failed to initiate payment.');
        }
      } catch (error) {
        console.error("PhonePe payment initiation failed", error);
        toast.error('Payment initiation failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#f4f7fa] to-[#dceefb] dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm w-full">
            <h2 className="text-3xl font-bold text-green-600 mb-2">🎉 Order Confirmed!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Thank you for your purchase.</p>
            <button
              onClick={() => {
                setShowSuccess(false);
                router.push('/');
              }}
              className="mt-4 px-5 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Checkout UI */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Cart Summary */}
        <div className="lg:w-1/2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">🛒 Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 border-b pb-4">
                  <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
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
        <div className="lg:w-1/2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Checkout</h2>
          <div className="grid gap-4">
            <input type="text" placeholder="Full Name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="input-style" />
            <input type="email" placeholder="Email" value={buyerEmail} disabled className="input-style bg-gray-100 text-gray-500" />
            <input type="tel" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))} className="input-style" />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="input-style" />
            <input type="text" placeholder="ZIP Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="input-style" />
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-style">
              <option value="cod">Cash on Delivery</option>
              <option value="online">PhonePe / UPI</option>
            </select>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              ref={recaptchaRef}
              onChange={handleRecaptchaChange}
              className="mt-2"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-xl font-semibold text-green-600">Total: ₹{getTotalPrice()}</span>
            <button
              onClick={handleConfirmPurchase}
              disabled={loading}
              className={`bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-lg px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ${
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

export default PhonePeCheckout;
