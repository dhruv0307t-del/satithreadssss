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
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [applying, setApplying] = useState(false);
  const { openModal } = useCheckoutModal();

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Compute discount amount based on flat vs percent
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "flat"
      ? Math.min(appliedCoupon.discount, subtotal)
      : Math.round((subtotal * appliedCoupon.discount) / 100)
    : 0;

  const total = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplying(true);
    setCouponMsg(null);
    const result = await applyCoupon(coupon.trim(), subtotal);
    setCouponMsg({ text: result.message, ok: result.ok });
    if (result.ok) setCoupon("");
    setApplying(false);
  };

  return (
    <>
      {/* ── Overlay ── */}
      <div
        className={`cd-overlay${isOpen ? " cd-overlay--open" : ""}`}
        onClick={closeCart}
      />

      {/* ── Sidebar ── */}
      <div className={`cd-sidebar${isOpen ? " cd-sidebar--open" : ""}`}>

        {/* Header */}
        <div className="cd-header">
          <div className="cd-header-title">
            <span>Your Cart</span>
            <span className="cd-count">{cart.length}</span>
          </div>
          <button className="cd-close" onClick={closeCart} aria-label="Close cart">×</button>
        </div>

        {/* Body */}
        {cart.length === 0 ? (
          <div className="cd-empty">
            <div className="cd-empty-icon">🛍️</div>
            <p className="cd-empty-title">Your cart is empty</p>
            <p className="cd-empty-sub">Add something beautiful to get started</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cd-items">
              {cart.map((item) => (
                <div className="cd-item" key={`${item.id}-${item.size}`}>
                  <div className="cd-item-img">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="cd-item-details">
                    <div className="cd-item-name">{item.title}</div>

                    <div className="cd-item-meta">
                      {item.size && (
                        <span className="cd-meta-chip">
                          <span className="cd-meta-label">Size</span> {item.size}
                        </span>
                      )}
                      <span className="cd-meta-chip">
                        <span className="cd-meta-label">Qty</span> {item.qty}
                      </span>
                    </div>

                    <div className="cd-item-footer">
                      <span className="cd-item-price">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                      <button
                        className="cd-remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cd-summary">

              {/* Coupon */}
              <div className="cd-coupon-section">
                <div className="cd-coupon-label">Have a Coupon?</div>

                {/* Applied coupon tag */}
                {appliedCoupon ? (
                  <div className="cd-applied-tag">
                    <span>🎟️ <strong>{appliedCoupon.code}</strong> applied&nbsp;
                      ({appliedCoupon.type === "flat"
                        ? `₹${appliedCoupon.discount} off`
                        : `${appliedCoupon.discount}% off`})
                    </span>
                    <button className="cd-remove-coupon" onClick={() => { removeCoupon(); setCouponMsg(null); }}>✕</button>
                  </div>
                ) : (
                  <>
                    <div className="cd-coupon-row">
                      <input
                        className="cd-coupon-input"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => { setCoupon(e.target.value); setCouponMsg(null); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <button
                        className="cd-coupon-btn"
                        onClick={handleApplyCoupon}
                        disabled={applying}
                      >
                        {applying ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`cd-coupon-msg${couponMsg.ok ? " ok" : " err"}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Price breakdown */}
              <div className="cd-breakdown">
                <div className="cd-breakdown-row">
                  <span className="cd-breakdown-label">Subtotal</span>
                  <span className="cd-breakdown-val">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="cd-breakdown-row">
                  <span className="cd-breakdown-label">Discount</span>
                  <span className="cd-breakdown-val cd-breakdown-val--green">
                    − ₹{discountAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="cd-breakdown-row">
                  <span className="cd-breakdown-label">Shipping</span>
                  <span className="cd-breakdown-val">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="cd-total-row">
                <span className="cd-total-label">Total</span>
                <span className="cd-total-val">₹{total.toLocaleString("en-IN")}</span>
              </div>

              {/* Actions */}
              <div className="cd-actions">
                <button className="cd-checkout-btn" onClick={() => { closeCart(); openModal(); }}>
                  Proceed to Checkout
                </button>
                <button className="cd-clear-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Scoped styles */}
      <style>{`
        :root {
          --cd-brown: #3d2415;
          --cd-brown-dark: #2d1810;
          --cd-brown-mid: #5a3825;
          --cd-amber: #D4A574;
          --cd-cream: #FFF7EC;
        }

        /* Overlay */
        .cd-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1400;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .cd-overlay--open {
          opacity: 1;
          visibility: visible;
        }

        /* Sidebar */
        .cd-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 480px;
          height: 100vh;
          background: white;
          box-shadow: -5px 0 30px rgba(0,0,0,0.15);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
          z-index: 1401;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cd-sidebar--open {
          transform: translateX(0);
        }

        /* Header */
        .cd-header {
          padding: 28px 28px;
          background: linear-gradient(135deg, var(--cd-brown) 0%, var(--cd-brown-dark) 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .cd-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 26px;
          font-weight: 400;
        }
        .cd-count {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--cd-amber);
          color: var(--cd-brown-dark);
          border-radius: 50%;
          font-size: 13px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
        }
        .cd-close {
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          line-height: 1;
          transition: all 0.3s ease;
        }
        .cd-close:hover {
          background: rgba(255,255,255,0.2);
          transform: rotate(90deg);
        }

        /* Empty */
        .cd-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--cd-brown-mid);
          text-align: center;
          padding: 40px;
        }
        .cd-empty-icon {
          font-size: 72px;
          opacity: 0.25;
          margin-bottom: 20px;
        }
        .cd-empty-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--cd-brown);
          margin-bottom: 8px;
        }
        .cd-empty-sub {
          font-size: 14px;
          opacity: 0.65;
        }

        /* Items scrollable area */
        .cd-items {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: var(--cd-cream);
        }
        .cd-items::-webkit-scrollbar { width: 5px; }
        .cd-items::-webkit-scrollbar-track { background: transparent; }
        .cd-items::-webkit-scrollbar-thumb { background: var(--cd-amber); border-radius: 3px; }

        /* Single item */
        .cd-item {
          display: flex;
          gap: 16px;
          padding: 18px;
          background: white;
          border-radius: 16px;
          margin-bottom: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: all 0.25s ease;
        }
        .cd-item:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        .cd-item-img {
          position: relative;
          width: 88px;
          height: 110px;
          border-radius: 10px;
          overflow: hidden;
          background: var(--cd-cream);
          flex-shrink: 0;
        }
        .cd-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cd-item-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--cd-brown);
          line-height: 1.3;
        }
        .cd-item-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .cd-meta-chip {
          font-size: 12px;
          color: var(--cd-brown-mid);
          background: var(--cd-cream);
          border-radius: 6px;
          padding: 3px 8px;
        }
        .cd-meta-label {
          font-weight: 700;
          margin-right: 3px;
        }
        .cd-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 6px;
        }
        .cd-item-price {
          font-size: 17px;
          font-weight: 700;
          color: var(--cd-amber);
        }
        .cd-remove {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 5px 10px;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .cd-remove:hover {
          background: rgba(220,53,69,0.08);
        }

        /* Summary */
        .cd-summary {
          padding: 22px 22px 24px;
          background: white;
          border-top: 2px solid rgba(212,165,116,0.2);
          flex-shrink: 0;
        }

        /* Coupon */
        .cd-coupon-section { margin-bottom: 20px; }
        .cd-coupon-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--cd-brown-mid);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .cd-coupon-row { display: flex; gap: 8px; }
        .cd-coupon-input {
          flex: 1;
          padding: 11px 14px;
          border: 2px solid #E5DDD3;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }
        .cd-coupon-input:focus {
          border-color: var(--cd-amber);
          box-shadow: 0 0 0 3px rgba(212,165,116,0.12);
        }
        .cd-coupon-btn {
          padding: 11px 20px;
          background: var(--cd-amber);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .cd-coupon-btn:hover {
          background: #C99156;
          transform: translateY(-1px);
        }
        .cd-coupon-msg {
          font-size: 12px;
          margin-top: 6px;
          padding: 5px 10px;
          border-radius: 6px;
          font-weight: 600;
        }
        .cd-coupon-msg.ok { background: #e8f9f0; color: #1a7a45; }
        .cd-coupon-msg.err { background: #fde8e8; color: #c0392b; }
        .cd-applied-tag {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #e8f9f0;
          border: 1.5px dashed #28a745;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #1a7a45;
          font-weight: 500;
        }
        .cd-remove-coupon {
          background: none;
          border: none;
          color: #c0392b;
          cursor: pointer;
          font-size: 15px;
          line-height: 1;
          padding: 2px 4px;
          border-radius: 4px;
          transition: background 0.15s;
        }
        .cd-remove-coupon:hover { background: rgba(220,53,69,0.08); }

        /* Breakdown */
        .cd-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 2px dashed rgba(212,165,116,0.3);
        }
        .cd-breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
        .cd-breakdown-label { color: var(--cd-brown-mid); }
        .cd-breakdown-val { color: var(--cd-brown); font-weight: 600; }
        .cd-breakdown-val--green { color: #28a745; }

        /* Total */
        .cd-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 16px 18px;
          background: linear-gradient(135deg, rgba(212,165,116,0.08) 0%, rgba(212,165,116,0.03) 100%);
          border-radius: 12px;
        }
        .cd-total-label {
          font-size: 16px;
          font-weight: 700;
          color: var(--cd-brown);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cd-total-val {
          font-size: 24px;
          font-weight: 800;
          color: var(--cd-amber);
          font-family: 'DM Serif Display', Georgia, serif;
        }

        /* Actions */
        .cd-actions { display: flex; flex-direction: column; gap: 10px; }
        .cd-checkout-btn {
          width: 100%;
          padding: 17px;
          background: linear-gradient(135deg, var(--cd-brown) 0%, var(--cd-brown-dark) 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(61,36,21,0.3);
          font-family: inherit;
        }
        .cd-checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(61,36,21,0.4);
        }
        .cd-clear-btn {
          width: 100%;
          padding: 13px;
          background: white;
          color: var(--cd-brown-mid);
          border: 2px solid #E5DDD3;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .cd-clear-btn:hover {
          border-color: var(--cd-amber);
          color: var(--cd-brown);
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .cd-sidebar {
            width: 100%;
          }
          .cd-header {
            padding: 20px;
          }
          .cd-header-title {
            font-size: 22px;
          }
          .cd-items {
            padding: 14px;
          }
          .cd-item {
            padding: 14px;
            gap: 12px;
          }
          .cd-item-img {
            width: 72px;
            height: 92px;
          }
          .cd-summary {
            padding: 18px 16px 20px;
          }
          .cd-coupon-row {
            flex-direction: column;
          }
          .cd-coupon-btn {
            width: 100%;
          }
          .cd-total-val {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
}
