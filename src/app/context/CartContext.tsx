'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[];
  quantity?: number;
};

type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const quantityToAdd = product.quantity ?? 1;

    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + quantityToAdd,
              }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 0) > 0)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
