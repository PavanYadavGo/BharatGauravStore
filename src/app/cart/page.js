"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
  } = useCart();

  return (
    <div className="container mx-auto px-6 py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <Image
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="rounded-md object-cover w-full h-64"
                />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-bold">₹{item.price} × {item.quantity}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => decreaseQuantity(item.id)} className="px-3 py-1 bg-gray-200 rounded text-sm">-</button>
                  <button onClick={() => increaseQuantity(item.id)} className="px-3 py-1 bg-gray-200 rounded text-sm">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm ml-auto">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-right space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Total: ₹{getTotalPrice()}
            </h2>

            {/* 🚀 Purchase Button */}
            <Link href="/checkout">
              <button className="bg-[#ff6740] text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600">
                Purchase
              </button>
            </Link>
          </div>
        </>
      )}

      <Link href="/products">
        <button className="mt-6 bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
