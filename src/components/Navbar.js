'use client'; // Needed for client-side interactivity

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode class on <html> tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 w-full z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-[#ff6740]">BHARATGAURAV</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-10 font-medium text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-red-500 transition">Home</Link>
          <Link href="/about" className="hover:text-red-500 transition">About Us</Link>
          <Link href="/products" className="hover:text-red-500 transition">Products</Link>
          <Link href="/contact" className="hover:text-red-500 transition">Contact Us</Link>
        </nav>

        {/* Sign In + Dark Mode Toggle */}
        <div className="flex items-center space-x-3 text-sm font-medium text-gray-800 dark:text-gray-200">
          <Link href="/signin" className="hover:text-red-500 transition">Sign in</Link>
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
