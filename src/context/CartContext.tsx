'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/order';
import { MenuItem } from '@/types/restaurant';
import { getStoredItem, setStoredItem } from '@/services/storage';

const CART_STORAGE_KEY = 'suburbplus_cart_items';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, restaurantName: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalUGX: number;
  deliveryFeeUGX: number;
  serviceFeeUGX: number;
  totalUGX: number;
  merchantName: string | null;
  merchantId: string | null;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(getStoredItem<CartItem[]>(CART_STORAGE_KEY, []));
  }, []);

  const saveItems = (newItems: CartItem[]) => {
    setItems(newItems);
    setStoredItem(CART_STORAGE_KEY, newItems);
  };

  const addItem = (item: MenuItem, restaurantName: string, quantity: number = 1) => {
    // If cart has items from another restaurant, ask or replace
    const hasDifferentMerchant = items.length > 0 && items[0].restaurantId !== item.restaurantId;
    let updatedItems = hasDifferentMerchant ? [] : [...items];

    const existingIndex = updatedItems.findIndex(i => i.menuItemId === item.id);
    if (existingIndex > -1) {
      const existing = updatedItems[existingIndex];
      const newQty = existing.quantity + quantity;
      updatedItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        itemTotalUGX: newQty * item.price,
      };
    } else {
      updatedItems.push({
        id: `cart_item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        menuItemId: item.id,
        restaurantId: item.restaurantId,
        restaurantName: restaurantName,
        name: item.name,
        priceUGX: item.price,
        quantity: quantity,
        itemTotalUGX: item.price * quantity,
        image: item.image,
      });
    }

    saveItems(updatedItems);
    setIsDrawerOpen(true);
  };

  const removeItem = (itemId: string) => {
    const updated = items.filter(i => i.id !== itemId);
    saveItems(updated);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const updated = items.map(i => {
      if (i.id === itemId) {
        return {
          ...i,
          quantity,
          itemTotalUGX: quantity * i.priceUGX,
        };
      }
      return i;
    });
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalUGX = items.reduce((sum, item) => sum + item.itemTotalUGX, 0);
  const deliveryFeeUGX = items.length > 0 ? 2000 : 0;
  const serviceFeeUGX = items.length > 0 ? 500 : 0;
  const totalUGX = subtotalUGX + deliveryFeeUGX + serviceFeeUGX;
  const merchantName = items.length > 0 ? items[0].restaurantName : null;
  const merchantId = items.length > 0 ? items[0].restaurantId : null;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotalUGX,
        deliveryFeeUGX,
        serviceFeeUGX,
        totalUGX,
        merchantName,
        merchantId,
        isDrawerOpen,
        setIsDrawerOpen,
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
