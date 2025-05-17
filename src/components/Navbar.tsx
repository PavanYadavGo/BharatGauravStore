'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import {
  FaShoppingCart, FaTrash, FaClipboardList,
  FaMoon, FaSun, FaUserEdit,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart();
  const { user, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = async () => {
    await logOut();
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
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#ff6740] tracking-tight">
          BHARATGAURAV
        </Link>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-6">
            {[['Home', '/'], ['About Us', '/about'], ['Products', '/products'], ['Contact Us', '/contact']].map(
              ([label, path]) => (
                <NavigationMenuItem key={path}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={path}
                      className="text-gray-700 dark:text-gray-200 hover:text-[#ff6740] transition"
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Nav Sheet */}
          <Sheet>
            <SheetTrigger className="md:hidden text-gray-700 dark:text-gray-200">
              ☰
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-6">
                {[['Home', '/'], ['About Us', '/about'], ['Products', '/products'], ['Contact Us', '/contact']].map(
                  ([label, path]) => (
                    <Link key={path} href={path} className="text-lg hover:text-[#ff6740]">
                      {label}
                    </Link>
                  )
                )}
                {!user && (
                  <>
                    <Link href="/signup">Sign Up</Link>
                    <Link href="/login">Login</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Cart Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <FaShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full animate-pulse">
                    {cart.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <h4 className="font-semibold text-base mb-3">Cart Items</h4>
              {cart.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">Cart is empty</p>
              ) : (
                <ul className="space-y-3 max-h-60 overflow-auto">
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
                        <p className="text-xs text-green-600">
                          ₹{item.price} × {item.quantity}
                        </p>
                        <div className="flex gap-2 mt-1 items-center">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="px-2 bg-gray-200 text-sm"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="px-2 bg-gray-200 text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-xs"
                          >
                            <FaTrash size={14} />
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
                  <Button className="w-full mt-2 bg-[#ff6740]" onClick={handleBuyNow}>
                    Purchase
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* User Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user.photoURL ?? undefined}
                    alt={user.displayName || 'User'}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>
                    {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium truncate">
                    {user.displayName || user.email}
                  </p>
                </div>
                <DropdownMenuItem onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <Link href="/orders">
                  <DropdownMenuItem>
                    <FaClipboardList className="mr-2 text-blue-500" /> Order History
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <FaUserEdit className="mr-2 text-blue-500" /> Edit Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <FiLogOut className="mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex space-x-3">
              <Link href="/signup" className="text-sm hover:text-[#ff6740]">Sign Up</Link>
              <Link href="/login" className="text-sm hover:text-[#ff6740]">Login</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
