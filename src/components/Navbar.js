'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '../app/context/CartContext'; // Adjust the path if needed
import { useAuth } from '../app/context/AuthContext'; // Firebase Auth context
import { FaShoppingCart } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    router.push('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 w-full z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-[#ff6740]">BHARATGAURAV</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-10 font-medium text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-red-500 transition">Home</Link>
          <Link href="/about" className="hover:text-red-500 transition">About Us</Link>
          <Link href="/products" className="hover:text-red-500 transition">Products</Link>
          <Link href="/contact" className="hover:text-red-500 transition">Contact Us</Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4 text-sm font-medium text-gray-800 dark:text-gray-200 relative">
          {/* Cart */}
          <div className="relative">
            <button onClick={() => setShowCart(!showCart)} className="relative">
              <FaShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {showCart && (
  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
    <h4 className="font-semibold text-base mb-3">Cart Items</h4>

    {cart.length === 0 ? (
      <p className="text-sm text-gray-600 dark:text-gray-400">Cart is empty</p>
    ) : (
      <ul className="max-h-60 overflow-y-auto space-y-3">
        {cart.map((item, index) => (
          <li key={index} className="flex items-center gap-3 border-b pb-2">
            {/* Product Image Preview */}
            <img
              src={item.image || item.images?.[0] || '/placeholder.jpg'}
              alt={item.name}
              className="w-12 h-12 object-cover rounded"
            />
            {/* Product Info */}
            <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-100 truncate w-40">
  {item.name}
</p>
              <p className="text-xs text-green-600 font-semibold">₹{item.price}</p>
            </div>
          </li>
        ))}
      </ul>
    )}

    <Link href="/cart">
      <button className="mt-4 w-full bg-[#ff6740] text-white text-sm py-2 rounded hover:bg-orange-600 transition">
        Go to Cart
      </button>
    </Link>
  </div>
)}
          </div>

          {/* Auth */}
          {!user ? (
            <>
              <Link href="/signup" className="hover:text-red-500 transition">Sign Up</Link>
              <Link href="/login" className="hover:text-red-500 transition">Login</Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-semibold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <span>{user.displayName || 'User'}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow rounded z-50">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
