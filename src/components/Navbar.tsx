'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../app/context/CartContext';
import { useAuth } from '../app/context/AuthContext';
import { FaShoppingCart, FaBars, FaTimes, FaSun, FaMoon, FaClipboardList, FaTrash } from 'react-icons/fa'; // Import FaTrash
import { FiLogOut } from 'react-icons/fi';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shouldBlink, setShouldBlink] = useState(false); // State to control blinking

  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const cartRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setShowCart(false);
    setShowDropdown(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !(cartRef.current as HTMLElement).contains(e.target as Node)) {
        setShowCart(false);
      }
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !(mobileMenuRef.current as HTMLElement).contains(e.target as Node) &&
        !(e.target as Element).closest('button[aria-label="Toggle Menu"]')
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Update blinking state based on cart items
    setShouldBlink(cart.length > 0);
  }, [cart]);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    router.push('/');
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    router.push('/checkout');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo + Menu Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-[#ff6740] tracking-tight">BHARATGAURAV</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 font-medium text-[clamp(0.9rem,1vw,1.05rem)] text-gray-700 dark:text-gray-200">
          {['/', '/about', '/products', '/contact'].map((path, i) => (
            <Link key={path} href={path} className="hover:text-[#ff6740] transition">
              {['Home', 'About Us', 'Products', 'Contact Us'][i]}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
          {/* Cart Icon */}
          <div className="relative" ref={cartRef}>
            <button onClick={() => setShowCart(!showCart)} aria-label="Cart" className="relative hover:text-[#ff6740]">
              <FaShoppingCart size={20} />
              {cart.length > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full ${
                    shouldBlink ? 'animate-blink' : ''
                  }`}
                >
                  {cart.length}
                </span>
              )}
            </button>
            {showCart && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
                <h4 className="font-semibold text-base mb-3">Cart Items</h4>
                {cart.length === 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cart is empty</p>
                ) : (
                  <ul className="space-y-3">
                    {cart.map((item, index) => (
                      <li key={index} className="flex gap-3 border-b pb-2">
                        <Image
                          src={item.images?.[0] || '/placeholder.jpg'}
                          alt={item.name || 'Product Image'}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate w-36">{item.name}</p>
                          <p className="text-xs text-green-600">₹{item.price} × {item.quantity}</p>
                          <div className="flex gap-2 mt-1 items-center">
                            <button onClick={() => decreaseQuantity(item.id)} className="px-2 bg-gray-200 text-sm" disabled={item.quantity <= 1}>-</button>
                            <button onClick={() => increaseQuantity(item.id)} className="px-2 bg-gray-200 text-sm">+</button>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">
                              <FaTrash size={14} /> {/* Replace FaTimes with FaTrash */}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {cart.length > 0 && (
                  <div className="mt-3">
                    <p className="text-right font-semibold text-green-600">Total: ₹{getTotalPrice()}</p>
                    <button
                      onClick={handleBuyNow}
                      className="w-full mt-2 bg-[#ff6740] hover:bg-orange-600 text-white text-sm py-2 rounded"
                    >
                      Purchase
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth / User */}
          {!user ? (
            <div className="hidden md:flex space-x-4">
              <Link href="/signup" className="hover:text-[#ff6740]">Sign Up</Link>
              <Link href="/login" className="hover:text-[#ff6740]">Login</Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="User Menu"
                className="flex items-center gap-2"
              >
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="User" width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 text-sm font-bold">
                    {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                )}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow rounded z-50">
                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600 dark:text-gray-300" />}
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>

                  <Link href="/orders" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FaClipboardList className="text-blue-500" /> Order History
                  </Link>

                  <hr className="border-t border-gray-200 dark:border-gray-700 my-1" />

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
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <nav className="flex flex-col space-y-4 text-[clamp(0.9rem,1vw,1.05rem)]">
            {['/', '/about', '/products', '/contact'].map((path, i) => (
              <Link key={path} href={path} onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ff6740]">
                {['Home', 'About Us', 'Products', 'Contact Us'][i]}
              </Link>
            ))}
            {!user && (
              <>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* CSS for the continuous blink animation on the badge */}
      <style jsx global>{`
        @keyframes continuous-blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-blink {
          animation: continuous-blink 1s ease-in-out infinite; /* Continuous blink */
        }
      `}</style>
    </header>
  );
};

export default Navbar;