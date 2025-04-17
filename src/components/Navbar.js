'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../app/context/CartContext';
import { useAuth } from '../app/context/AuthContext';
import { FaShoppingCart } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const cartRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
  }, [darkMode]);

  // Handle click outside cart or dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    router.push('/');
  };

  const handleBuyNow = () => {
    if (cart.length > 0 && cart[0]?.id) {
      router.push(`/checkout?productId=${cart[0].id}`);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-[#ff6740]">BHARATGAURAV</span>
        </div>

        <nav className="hidden md:flex items-center space-x-10 font-medium text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-red-500">Home</Link>
          <Link href="/about" className="hover:text-red-500">About Us</Link>
          <Link href="/products" className="hover:text-red-500">Products</Link>
          <Link href="/contact" className="hover:text-red-500">Contact Us</Link>
        </nav>

        <div className="flex items-center space-x-4 text-sm font-medium text-gray-800 dark:text-gray-200 relative">
          <div className="relative" ref={cartRef}>
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
                        <img
                          src={item.images?.[0] || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate w-36">{item.name}</p>
                          <p className="text-xs text-green-600">₹{item.price} × {item.quantity}</p>
                          <div className="flex gap-2 mt-1">
                            <button onClick={() => decreaseQuantity(item.id)} className="px-2 bg-gray-200 text-sm">-</button>
                            <button onClick={() => increaseQuantity(item.id)} className="px-2 bg-gray-200 text-sm">+</button>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">Remove</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-sm font-bold text-right text-green-600">
                  Total: ₹{getTotalPrice()}
                </p>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-[#ff6740] text-white text-sm py-2 rounded hover:bg-orange-600"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            )}
          </div>

          {!user ? (
            <>
              <Link href="/signup" className="hover:text-red-500">Sign Up</Link>
              <Link href="/login" className="hover:text-red-500">Login</Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="User" width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 text-sm font-bold">
                    {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                )}
                <span className="max-w-[140px] truncate">
                  {user?.username || 'User'}
                </span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow rounded z-50">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
