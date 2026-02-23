'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import type { MenuItem } from './menu-data';
import { menuItems } from './menu-data';

const CART_STORAGE_KEY = 'golden-dragon-cart';

export interface CartEntry {
  menuItemId: string;
  quantity: number;
}

type CartContextType = {
  cart: CartEntry[];
  addItem: (menuItemId: string, quantity?: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getItem: (id: string) => MenuItem | undefined;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(userId: string | undefined): CartEntry[] {
  if (typeof window === 'undefined' || !userId) return [];
  try {
    const raw = localStorage.getItem(`${CART_STORAGE_KEY}_${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(userId: string, cart: CartEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${CART_STORAGE_KEY}_${userId}`, JSON.stringify(cart));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartEntry[]>([]);

  useEffect(() => {
    setCart(loadCart(user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      saveCart(user.id, cart);
    }
  }, [user?.id, cart]);

  const addItem = useCallback((menuItemId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.menuItemId === menuItemId);
      if (existing) {
        return prev.map((e) =>
          e.menuItemId === menuItemId ? { ...e, quantity: e.quantity + quantity } : e
        );
      }
      return [...prev, { menuItemId, quantity }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setCart((prev) => prev.filter((e) => e.menuItemId !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((e) => e.menuItemId !== menuItemId));
      return;
    }
    setCart((prev) =>
      prev.map((e) => (e.menuItemId === menuItemId ? { ...e, quantity } : e))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((sum, e) => sum + e.quantity, 0);
  const totalPrice = cart.reduce((sum, e) => {
    const item = menuItems.find((m) => m.id === e.menuItemId);
    return sum + (item ? item.price * e.quantity : 0);
  }, 0);

  const getItem = useCallback((id: string) => menuItems.find((m) => m.id === id), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
