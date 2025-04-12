"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart } = useCart();

  return (
    <div className="container mx-auto px-6 py-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <Image
                src={item.images?.[0] || "/placeholder-image.jpg"}
                alt={item.name}
                width={300}
                height={300}
                className="rounded-md object-cover w-full h-64"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {item.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Continue Shopping Button */}
      <Link href="/products">
        <button className="mt-6 bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md transition hover:bg-gray-700 dark:hover:bg-gray-500">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
