"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import Image from "next/image";
import { useCouponModal } from "../context/CouponModalContext";

export default function CouponPopup() {
    const { isOpen, closeModal, openModal } = useCouponModal();
    const [coupon, setCoupon] = useState<any>(null);

    // Auto-open on first load if we have a coupon
    useEffect(() => {
        fetch("/api/coupons")
            .then(res => res.json())
            .then(data => {
                // Find latest active coupon with an image
                const latest = data.find((c: any) => c.isActive && c.imageUrl);
                if (latest) {
                    setCoupon(latest);
                    setTimeout(() => {
                        openModal();
                    }, 1500);
                }
            })
            .catch(err => console.error("Failed to fetch coupons", err));
    }, [openModal]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !coupon) return null;

    return (
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
            }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(10px)",
                animation: "fadeIn 0.3s ease-in-out",
            }}
        >
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "600px",
                    margin: "0 1rem",
                    backgroundColor: "#F5F1E8",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5)",
                    animation: "slideUp 0.5s ease-out",
                    border: "3px solid #CD853F",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #8B4513 0%, #CD853F 50%, #8B4513 100%)",
                        padding: "30px 24px",
                        position: "relative",
                        overflow: "hidden",
                        textAlign: "center"
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255, 255, 255, 0.25)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF",
                            transition: "all 0.2s",
                            zIndex: 10,
                        }}
                    >
                        <X size={18} />
                    </button>

                    <h2
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#FFFFFF",
                            marginBottom: "4px",
                            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                    >
                        ✨ Exclusive Offer ✨
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.9)" }}>Limited time only</p>
                </div>

                {/* Coupon Image */}
                <div style={{ padding: "24px" }}>
                    <div
                        style={{
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                            border: "2px solid #CD853F",
                            width: "100%",
                            height: "auto",
                            backgroundColor: "#F5F5DC",
                            marginBottom: "20px"
                        }}
                    >
                        <img
                            src={coupon.imageUrl}
                            alt={coupon.code}
                            style={{
                                display: "block",
                                width: "100%",
                                maxHeight: "300px",
                                objectFit: "cover",
                            }}
                        />
                    </div>

                    <div className="text-center space-y-2">
                        <p className="font-bold text-gray-800 text-lg">Use Code:</p>
                        <div
                            className="inline-block bg-white border-2 border-dashed border-[#CD853F] px-8 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => {
                                navigator.clipboard.writeText(coupon.code);
                                alert("Code copied!");
                            }}
                        >
                            <span className="text-2xl font-mono font-bold tracking-widest text-[#8B4513]">{coupon.code}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Click to copy code</p>
                    </div>

                    {/* Footer instruction */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            marginTop: "20px",
                            padding: "12px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            border: "1px solid #CD853F",
                        }}
                    >
                        <Sparkles size={16} color="#8B4513" />
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#5D4E37",
                                margin: 0,
                                fontWeight: "500",
                            }}
                        >
                            {coupon.discount}{coupon.type === "percent" ? "%" : "₹"} OFF on orders above ₹{coupon.minCartValue}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
