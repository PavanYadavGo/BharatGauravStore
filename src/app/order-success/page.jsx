'use client';

import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function OrderSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart only once on first render
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Empty dependency array prevents re-runs

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <h1 className="text-2xl font-bold text-green-700">🎉 Your order was placed successfully!</h1>
    </div>
  );
}
