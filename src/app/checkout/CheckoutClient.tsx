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
    if (!document.getElementById('phonepe-style')) {
      const style = document.createElement('style');
      style.id = 'phonepe-style';
      style.innerHTML = `/* Add any needed styles */`;
      document.head.appendChild(style);
    }
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
  }, [user, authLoading, router]);

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
      router.push('/');
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
      try {
        const response = await fetch('/api/phonepe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: getTotalPrice(),
            userId: user?.uid,
            name: buyerName,
            email: buyerEmail,
            contact: contactNumber,
          }),
        });

        if (!response.ok) throw new Error('PhonePe payment initiation failed.');

        const { redirectUrl } = await response.json();

        if (!redirectUrl) throw new Error('Invalid PhonePe URL.');

        window.location.href = redirectUrl; // Redirect to PhonePe payment page
      } catch (error) {
        console.error('PhonePe Error:', error);
        toast.error('Payment failed, please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f4f7fa] to-[#dceefb] dark:from-gray-900 dark:to-gray-800 p-4">
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
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} ref={recaptchaRef} onChange={handleRecaptchaChange} className="mt-2" />
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-xl font-semibold text-green-600">Total: ₹{getTotalPrice()}</span>
            <button onClick={handleConfirmPurchase} disabled={loading} className={`bg-[#ff6740] hover:bg-orange-600 text-white px-6 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
