"use client";

import { createContext, useContext, useState } from "react";

// Create the Cart Context
const CartContext = createContext();

// Cart Provider to Wrap the App
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Cart state

  // Function to add item to cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]); // Add to cart
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use the Cart Context
export const useCart = () => useContext(CartContext);
