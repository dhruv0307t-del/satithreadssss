"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCheckoutModal } from "../context/CheckoutModalContext";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeItem,
    clearCart,
    discount,
    applyCoupon,
  } = useCart();

  const [coupon, setCoupon] = useState("");
  const { openModal } = useCheckoutModal();
  const subtotal = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      {/* HEADER */}
      <div className="cart-header">
        <h2>Cart ({cart.length})</h2>
        <button onClick={closeCart}>✕</button>
      </div>

      {/* EMPTY */}
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          {/* ITEMS */}
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-img">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="cart-details">
                  <h4>{item.title}</h4>
                  <p className="cart-size">Size: M</p>

                  <div className="cart-qty-row">
                    <span>Qty: {item.qty}</span>
                    <span className="cart-price">
                      Rs. {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COUPON */}
          <div className="coupon-box">
            <input
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button onClick={() => applyCoupon(coupon)}>
              Apply
            </button>
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </div>

            <div>
              <span>Discount</span>
              <span>- Rs. {discountAmount.toFixed(2)}</span>
            </div>

            <div className="total-row">
              <strong>Total</strong>
              <strong>Rs. {total.toFixed(2)}</strong>
            </div>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>

          {/* FOOTER */}
          <div className="cart-footer">
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>

            <button
              className="checkout-btn"
              onClick={() => openModal()}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
