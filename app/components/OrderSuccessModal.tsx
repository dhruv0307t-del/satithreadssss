"use client";

import { useEffect, useRef, useCallback } from "react";

export interface OrderSuccessData {
  orderId: string;
  total: number;
  status?: string;
  items?: number;
  estimatedDelivery?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: OrderSuccessData | null;
}

export default function OrderSuccessModal({ isOpen, onClose, order }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  /* ── Confetti ── */
  const runConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    const modal = modalRef.current;
    if (!canvas || !modal) return;
    canvas.width = modal.offsetWidth;
    canvas.height = modal.offsetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["#3A6B50","#5DA87A","#D4A843","#F5E070","#EAF4EE","#FBF3DC","#B8860B","#C8E6D5"];
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 80,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2.5 + Math.random() * 3.5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.18,
      alpha: 1,
    }));

    let frames = 0;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.vy *= 0.99;
        if (p.y > canvas.height * 0.6) p.alpha -= 0.025;
        if (p.alpha <= 0) return;
        alive++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive > 0 && frames < 180) {
        frames++;
        animFrameRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animFrameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(runConfetti, 600);
      return () => {
        clearTimeout(timer);
        cancelAnimationFrame(animFrameRef.current);
      };
    } else {
      document.body.style.overflow = "";
      cancelAnimationFrame(animFrameRef.current);
    }
  }, [isOpen, runConfetti]);

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* ── Copy order ID ── */
  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderId).then(() => showToast("Order ID copied!"));
  };

  const showToast = (msg: string) => {
    let t = document.getElementById("__order-toast") as HTMLDivElement | null;
    if (!t) {
      t = document.createElement("div");
      t.id = "__order-toast";
      t.style.cssText =
        "position:fixed;bottom:28px;right:24px;background:#3A6B50;color:#fff;padding:11px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,0.14);transition:all .3s;transform:translateY(20px);opacity:0;font-family:DM Sans,sans-serif;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    t.style.transform = "translateY(0)";
    setTimeout(() => {
      if (t) { t.style.opacity = "0"; t.style.transform = "translateY(20px)"; }
    }, 2500);
  };

  if (!isOpen || !order) return null;

  const shortId = "#" + order.orderId.slice(0, 12);
  const totalFormatted = "₹" + Number(order.total).toLocaleString("en-IN");
  const itemsText = (order.items || 1) + " item" + ((order.items ?? 1) > 1 ? "s" : "");
  const statusText = order.status
    ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
    : "Placed";
  const deliveryText = (order.estimatedDelivery || "3–5 business days") + " · Free Shipping";

  return (
    <div
      className="order-overlay open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="order-modal" ref={modalRef}>
        {/* Confetti canvas */}
        <canvas ref={canvasRef} id="confettiCanvas" />

        {/* Close */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Hero */}
        <div className="modal-hero">
          <div className="success-icon-wrap">
            <svg className="success-checkmark" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" />
              <path d="M10 18 l5 5 l11 -11" />
            </svg>
          </div>
          <div className="hero-title">Order Placed Successfully!</div>
          <div className="hero-subtitle">
            Thank you for shopping with Sati Threads 🌸<br />
            We&apos;ll start processing your order right away.
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Order ID */}
          <div className="order-id-row">
            <div>
              <div className="order-id-label">Order ID</div>
              <div className="order-id-value">{shortId}</div>
            </div>
            <button className="copy-btn" onClick={copyOrderId}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy
            </button>
          </div>

          {/* Summary grid */}
          <div className="summary-grid">
            <div className="summary-item">
              <div className="s-label">Amount Paid</div>
              <div className="s-val green">{totalFormatted}</div>
            </div>
            <div className="summary-item">
              <div className="s-label">Items</div>
              <div className="s-val">{itemsText}</div>
            </div>
            <div className="summary-item">
              <div className="s-label">Status</div>
              <div style={{ marginTop: 2 }}>
                <span className="status-badge">
                  <span className="status-dot" />
                  {statusText}
                </span>
              </div>
            </div>
            <div className="summary-item">
              <div className="s-label">Payment</div>
              <div className="s-val gold">Confirmed ✓</div>
            </div>
          </div>

          {/* Delivery estimate */}
          <div className="delivery-strip">
            <div className="delivery-icon">📦</div>
            <div className="delivery-text">
              <strong>Estimated Delivery</strong>
              <span>{deliveryText}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <a href={`/orders/${order.orderId}`} className="btn btn-primary" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
              Track My Order
            </a>
            <a href="/" className="btn btn-ghost" onClick={onClose}>
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
