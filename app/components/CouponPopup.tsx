"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import Image from "next/image";
import { useCouponModal } from "../context/CouponModalContext";

export default function CouponPopup() {
    const { isOpen, closeModal, openModal } = useCouponModal();
    const [coupon, setCoupon] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAutoShown, setHasAutoShown] = useState(false);

    // Fetch coupons on mount
    useEffect(() => {
        console.log("CouponPopup: Fetching coupons...");
        setIsLoading(true);

        fetch("/api/coupons")
            .then(res => {
                console.log("CouponPopup: API response status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("CouponPopup: Fetched data:", data);
                // Find latest active coupon with an image
                const latest = data.find((c: any) => c.isActive && c.imageUrl);
                console.log("CouponPopup: Found active coupon with image:", latest);

                if (latest) {
                    setCoupon(latest);
                } else {
                    console.log("CouponPopup: No active coupon with image found");
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("CouponPopup: Failed to fetch coupons", err);
                setIsLoading(false);
            });
    }, []);

    // Auto-show popup only once on first visit
    useEffect(() => {
        if (!coupon || hasAutoShown) return;

        // Check if popup has been shown before
        const hasShownBefore = localStorage.getItem("couponPopupShown");

        if (!hasShownBefore) {
            console.log("CouponPopup: Auto-showing popup for first time");
            setTimeout(() => {
                openModal();
                localStorage.setItem("couponPopupShown", "true");
                setHasAutoShown(true);
            }, 1500);
        } else {
            console.log("CouponPopup: Popup already shown before, skipping auto-show");
            setHasAutoShown(true);
        }
    }, [coupon, hasAutoShown, openModal]);

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
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(10px)",
                animation: "fadeIn 0.3s ease-in-out",
                padding: "1rem",
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
        
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .coupon-modal-container {
            max-width: 95vw !important;
            margin: 0 !important;
          }
          
          .coupon-header {
            padding: 12px 16px !important;
          }
          
          .coupon-title {
            font-size: 18px !important;
          }
          
          .coupon-content {
            padding: 12px !important;
          }
          
          .coupon-image-container {
            max-height: 150px !important;
            margin-bottom: 12px !important;
          }
          
          .coupon-code {
            font-size: 14px !important;
            padding: 8px 16px !important;
          }
          
          .coupon-code span {
            font-size: 16px !important;
          }
          
          .coupon-footer {
            padding: 8px !important;
            font-size: 11px !important;
            margin-top: 12px !important;
          }
          
          .use-code-text {
            font-size: 14px !important;
            margin-bottom: 8px !important;
          }
          
          .copy-text {
            font-size: 11px !important;
          }
        }
        
        @media (max-width: 480px) {
          .coupon-modal-container {
            max-width: calc(100vw - 20px) !important;
          }
          
          .coupon-header {
            padding: 10px 12px !important;
          }
          
          .coupon-title {
            font-size: 16px !important;
          }
          
          .coupon-content {
            padding: 10px !important;
          }
          
          .coupon-code {
            font-size: 12px !important;
            padding: 6px 12px !important;
          }
          
          .coupon-code span {
            font-size: 14px !important;
          }
          
          .coupon-image-container {
            max-height: 130px !important;
          }
          
          .close-button {
            width: 28px !important;
            height: 28px !important;
            top: 8px !important;
            right: 8px !important;
          }
        }
      `}</style>

            <div
                className="coupon-modal-container"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "600px",
                    margin: "0 auto",
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
                    className="coupon-header"
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
                        className="close-button"
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
                        className="coupon-title"
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
                    <p style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>Limited time only</p>
                </div>

                {/* Coupon Image */}
                <div className="coupon-content" style={{ padding: "24px" }}>
                    <div
                        className="coupon-image-container"
                        style={{
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                            border: "2px solid #CD853F",
                            width: "100%",
                            minHeight: "120px",
                            height: "auto",
                            backgroundColor: "#F5F5DC",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <img
                            src={coupon.imageUrl}
                            alt={coupon.code}
                            style={{
                                display: "block",
                                width: "100%",
                                height: "auto",
                                maxHeight: "300px",
                                objectFit: "contain",
                            }}
                        />
                    </div>

                    <div className="text-center space-y-2">
                        <p className="font-bold text-gray-800 text-lg use-code-text">Use Code:</p>
                        <div
                            className="inline-block bg-white border-2 border-dashed border-[#CD853F] rounded-xl cursor-pointer hover:bg-gray-50 transition coupon-code"
                            style={{ padding: "12px 32px" }}
                            onClick={() => {
                                navigator.clipboard.writeText(coupon.code);
                                alert("Code copied!");
                            }}
                        >
                            <span className="text-2xl font-mono font-bold tracking-widest text-[#8B4513]">{coupon.code}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 copy-text">Click to copy code</p>
                    </div>

                    {/* Footer instruction */}
                    <div
                        className="coupon-footer"
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
