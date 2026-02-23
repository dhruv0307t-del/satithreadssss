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

export type AppliedCoupon = {
  code: string;
  discount: number;          // value (% or flat ₹)
  type: "flat" | "percent";
};

type CartContextType = {
  cart: CartItem[];
  isOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, cartTotal?: number) => Promise<{ ok: boolean; message: string }>;
  removeCoupon: () => void;
};

/* ================= CONTEXT ================= */

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  /* ADD TO CART */
  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === product.size);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === product.size
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { ...product, qty: product.qty ?? 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  /* APPLY COUPON — hits the DB validate API */
  const applyCoupon = async (
    code: string,
    cartTotal?: number
  ): Promise<{ ok: boolean; message: string }> => {
    if (!code.trim()) return { ok: false, message: "Enter a coupon code" };

    try {
      const subtotal =
        cartTotal ??
        cart.reduce((sum, i) => sum + i.price * i.qty, 0);

      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), cartTotal: subtotal }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAppliedCoupon(null);
        return { ok: false, message: data.message || "Invalid coupon" };
      }

      setAppliedCoupon({
        code: data.code,
        discount: data.discount,
        type: data.type,
      });

      const saved =
        data.type === "flat"
          ? data.discount
          : Math.round((subtotal * data.discount) / 100);

      return {
        ok: true,
        message: `Coupon applied! You save ₹${saved.toLocaleString("en-IN")} 🎉`,
      };
    } catch {
      return { ok: false, message: "Could not validate coupon. Try again." };
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        appliedCoupon,
        openCart,
        closeCart,
        addToCart,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
