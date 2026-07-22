'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  foodId: string;
  name: string;
  nameTa: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  imageUrl?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (food: { id: string; name: string; nameTa: string; price: number; isVeg: boolean; imageUrl?: string }) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('amutha_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('amutha_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food: { id: string; name: string; nameTa: string; price: number; isVeg: boolean; imageUrl?: string }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.foodId === food.id);
      if (existing) {
        return prev.map((item) =>
          item.foodId === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: food.id,
          foodId: food.id,
          name: food.name,
          nameTa: food.nameTa,
          price: food.price,
          quantity: 1,
          isVeg: food.isVeg,
          imageUrl: food.imageUrl,
        },
      ];
    });
  };

  const removeFromCart = (foodId: string) => {
    setCart((prev) => prev.filter((item) => item.foodId !== foodId));
  };

  const updateQuantity = (foodId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.foodId === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + gstAmount) * 100) / 100;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        gstAmount,
        grandTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
