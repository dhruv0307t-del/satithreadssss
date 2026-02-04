"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

/* ================= TYPES ================= */

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  size?: string;
};

type CartContextType = {
  cart: CartItem[];
  isOpen: boolean;
  discount: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
};

/* ================= CONTEXT ================= */

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [discount, setDiscount] = useState<number>(0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  /* 🔥 ADD TO CART — FIXED */
  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: product.qty ?? 1,
        },
      ];
    });

    setIsOpen(true); // 🔥 auto open drawer
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const applyCoupon = (code: string) => {
    if (code === "SATI10") setDiscount(10);
    else if (code === "SATI20") setDiscount(20);
    else alert("Invalid Coupon");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        discount,
        openCart,
        closeCart,
        addToCart,
        removeItem,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};
