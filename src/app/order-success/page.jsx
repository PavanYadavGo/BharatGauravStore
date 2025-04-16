'use client';

import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function OrderSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // Clear cart on page load
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <h1 className="text-2xl font-bold text-green-700">🎉 Your order was placed successfully!</h1>
    </div>
  );
}
