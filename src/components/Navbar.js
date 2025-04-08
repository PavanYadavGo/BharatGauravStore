"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Detect system theme on first visit and apply it
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");

      if (!savedTheme) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
        localStorage.setItem("theme", prefersDark ? "dark" : "light");
      } else {
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }

      setMounted(true); // Ensure theme loads before hydration
    }
  }, []);

  if (!mounted) return null; // Prevent mismatch on hydration

  return (
    <nav className="bg-white dark:bg-gray-900 shadow p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          BharatGaurav Store
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Products
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
            Contact
          </Link>

          {/* Cart Icon with Badge */}
          <Link href="/cart" className="relative">
            <FaShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
