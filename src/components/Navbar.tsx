'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext'; // Corrected path to AuthContext
import { FaShoppingCart, FaTrash, FaClipboardList, FaMoon, FaSun, FaUserEdit, FaSearch } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from '../components/ui/navigation-menu';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductDrawer from '../components/ProductDrawer'; // Import the ProductDrawer component

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [drawerProductId, setDrawerProductId] = useState<string | null>(null); // State to control the ProductDrawer
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart();
  const { user, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (showSearch) {
      console.log("Search bar opened. Fetching products...");
      fetchProducts();
      setSearch('');
      setFiltered([]);
    }
  }, [showSearch]);

  useEffect(() => {
    if (search.length > 0 && products.length > 0) {
      const keyword = search.toLowerCase();
      const result = products.filter((p) =>
        p.name?.toLowerCase().includes(keyword) || p.description?.toLowerCase().includes(keyword)
      );
      setFiltered(result);
    } else if (search.length === 0) {
      setFiltered([]);
    }
  }, [search, products]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
      console.log("Products fetched successfully:", productList);
      if (productList.length === 0) {
        console.warn("No products found in the 'products' collection in Firebase.");
      }
    } catch (error) {
      console.error('Failed to fetch products from Firebase:', error);
    }
  };

  const handleSearchButtonClick = () => {
    console.log("Search button clicked or Enter pressed. Searching for:", search);
    const keyword = search.toLowerCase();
    const result = products.filter((p) =>
      p.name?.toLowerCase().includes(keyword) || p.description?.toLowerCase().includes(keyword)
    );
    setFiltered(result);
    if (result.length === 0 && search.length > 0) {
      console.log(`No products found for "${search}"`);
    }
  };

  // New function to handle opening the drawer from search results
  const handleOpenDrawer = (productId: string) => {
    setDrawerProductId(productId); // Set the product ID for the drawer
    setShowSearch(false);          // Close the search bar
  };

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
    <>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#ff6740] tracking-tight">
            BHARATGAURAV
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-6">
              {[
                ['Home', '/'],
                ['About Us', '/about'],
                ['Products', '/products'],
                ['Contact Us', '/contact'],
              ].map(([label, path]) => (
                <NavigationMenuItem key={path}>
                  <NavigationMenuLink asChild>
                    <Link href={path} className="text-gray-700 dark:text-gray-200 hover:text-[#ff6740] transition">
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <FaSearch />
            </Button>

            <Sheet>
              <SheetTrigger className="md:hidden text-gray-700 dark:text-gray-200">☰</SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {[
                    ['Home', '/'],
                    ['About Us', '/about'],
                    ['Products', '/products'],
                    ['Contact Us', '/contact'],
                  ].map(([label, path]) => (
                    <Link key={path} href={path} className="text-lg hover:text-[#ff6740]">{label}</Link>
                  ))}
                  {!user && (
                    <>
                      <Link href="/signup">Sign Up</Link>
                      <Link href="/login">Login</Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

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
                          <p className="text-xs text-green-600">₹{item.price} × {item.quantity}</p>
                          <div className="flex gap-2 mt-1 items-center">
                            <button onClick={() => decreaseQuantity(item.id)} className="px-2 bg-gray-200 text-sm" disabled={item.quantity <= 1}>-</button>
                            <button onClick={() => increaseQuantity(item.id)} className="px-2 bg-gray-200 text-sm">+</button>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">
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
                    <Button className="w-full mt-2 bg-[#ff6740]" onClick={handleBuyNow}>Purchase</Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || 'User'} referrerPolicy="no-referrer" />
                    <AvatarFallback>{(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </DropdownMenuItem>
                  <Link href="/orders"><DropdownMenuItem><FaClipboardList className="mr-2 text-blue-500" /> Order History</DropdownMenuItem></Link>
                  <Link href="/profile"><DropdownMenuItem><FaUserEdit className="mr-2 text-blue-500" /> Edit Profile</DropdownMenuItem></Link>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500"><FiLogOut className="mr-2" /> Logout</DropdownMenuItem>
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

      {showSearch && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur z-[60]">
          <div className="max-w-2xl mx-auto mt-24 px-4 relative">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchButtonClick();
                  }
                }}
                className="flex-1 p-3 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-[#ff6740]"
                autoFocus
              />
              <Button
                onClick={handleSearchButtonClick}
                className="bg-[#ff6740] hover:bg-[#e05a39] text-white p-3 rounded-lg shadow"
                aria-label="Search"
              >
                <FaSearch />
              </Button>
            </div>
            {filtered.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow z-50">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((product) => (
                    <li key={product.id}>
                      {/* Changed from Link to a div that opens the drawer */}
                      <div
                        onClick={() => handleOpenDrawer(product.id)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <Image
                          src={product.images?.[0] || '/placeholder.jpg'}
                          alt={product.name || 'Product Image'}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {search.length > 0 && filtered.length === 0 && products.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow z-50">
                <p className="text-center text-gray-500 dark:text-gray-400">No products found for "{search}"</p>
              </div>
            )}
            {products.length === 0 && !search && (
              <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow z-50">
                <p className="text-center text-gray-500 dark:text-gray-400">Loading products or no products available in the store.</p>
              </div>
            )}
          </div>

          <button className="absolute top-4 right-4 text-2xl text-gray-700 dark:text-gray-200 hover:text-[#ff6740]" onClick={() => setShowSearch(false)}>✕</button>
        </div>
      )}

      {/* Render ProductDrawer conditionally */}
      {drawerProductId && (
        <ProductDrawer productId={drawerProductId} onClose={() => setDrawerProductId(null)} />
      )}
    </>
  );
};

export default Navbar;