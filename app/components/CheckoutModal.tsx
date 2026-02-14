"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useCheckoutModal } from "@/app/context/CheckoutModalContext";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function CheckoutModal() {
    const { isOpen, closeModal } = useCheckoutModal();
    const { cart, clearCart } = useCart();
    const { data: session, status } = useSession();
    const { openModal: openAuthModal } = useAuthModal();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    // Lock body scroll when modal is open
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

    // Check authentication when modal opens
    useEffect(() => {
        if (isOpen && status === "unauthenticated") {
            closeModal();
            openAuthModal("/checkout");
        }
    }, [isOpen, status, closeModal, openAuthModal]);

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [couponDetails, setCouponDetails] = useState<any>(null);
    const [couponError, setCouponError] = useState("");

    // Validation
    const isAddressValid = Object.values(address).every((v) => v.trim() !== "");

    if (!isOpen) return null;

    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const validateCoupon = async () => {
        if (!couponCode) return;
        setCouponError("");

        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, cartTotal: subtotal })
            });
            const data = await res.json();

            if (data.success) {
                setCouponDetails(data);
            } else {
                setCouponError(data.message);
                setCouponDetails(null);
            }
        } catch (err) {
            setCouponError("Failed to validate coupon");
        }
    };

    const finalTotal = couponDetails
        ? couponDetails.type === "percentage"
            ? subtotal - (subtotal * couponDetails.discount / 100)
            : subtotal - couponDetails.discount
        : subtotal;

    const placeOrder = async () => {
        if (!isAddressValid) {
            setError("Please fill all address fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    shippingAddress: address,
                    paymentMethod: "COD",
                    couponCode: couponDetails?.code,
                    discountAmount: subtotal - finalTotal
                }),
            });

            const data = await res.json();

            if (data.success) {
                clearCart();
                closeModal();
                resetForm();
                router.push(`/orders/${data.orderId}`);
            } else {
                setError(data.message || "Order failed");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAddress({
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
        });
        setError("");
        setCouponCode("");
        setCouponDetails(null);
        setCouponError("");
    };

    const handleClose = () => {
        closeModal();
        resetForm();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="checkout-modal-overlay"
        >
            <div className="checkout-modal-content">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="checkout-close-btn"
                >
                    <X size={24} />
                </button>

                {/* Title */}
                <h1 className="checkout-title">
                    Checkout
                </h1>

                {/* Error Message */}
                {error && (
                    <div className="checkout-error">
                        {error}
                    </div>
                )}

                {/* Order Summary */}
                <div className="checkout-order-summary">
                    <h3
                        style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "16px",
                            color: "#1A202C",
                        }}
                    >
                        Order Summary
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Items ({cart.length})</span>
                        <span style={{ fontWeight: "500" }}>Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: "12px",
                            borderTop: "1px solid #E5E7EB",
                            fontWeight: "600",
                            fontSize: "18px",
                        }}
                    >
                        <span>Total</span>
                        <span>Rs. {subtotal.toFixed(2)}</span>
                    </div>

                    {/* Coupon Input */}
                    <div style={{ margin: "16px 0", display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "10px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "8px"
                            }}
                        />
                        <button
                            onClick={(e) => { e.preventDefault(); validateCoupon(); }}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#333",
                                color: "#fff",
                                borderRadius: "8px",
                                fontWeight: "600"
                            }}
                        >
                            Apply
                        </button>
                    </div>
                    {couponError && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{couponError}</p>}
                    {couponDetails && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "green" }}>
                            <span>Discount ({couponDetails.code})</span>
                            <span>- Rs. {(subtotal - finalTotal).toFixed(2)}</span>
                        </div>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            paddingTop: "12px",
                            borderTop: "1px solid #E5E7EB",
                            fontWeight: "600",
                            fontSize: "18px",
                        }}
                    >
                        <span>Total Payble</span>
                        <span>Rs. {finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Shipping Address Form */}
                <h3
                    style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "20px",
                        color: "#1A202C",
                    }}
                >
                    Shipping Address
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
                    <div className="checkout-form-grid">
                        {/* Full Name */}
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            className="checkout-input"
                        />

                        {/* Phone */}
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                            className="checkout-input"
                        />

                        {/* Address - Full Width */}
                        <input
                            type="text"
                            placeholder="Street Address"
                            value={address.address}
                            onChange={(e) => setAddress({ ...address, address: e.target.value })}
                            className="checkout-input checkout-input-full"
                        />

                        {/* City */}
                        <input
                            type="text"
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="checkout-input"
                        />

                        {/* State */}
                        <input
                            type="text"
                            placeholder="State"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className="checkout-input"
                        />

                        {/* Pincode - Full Width */}
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            className="checkout-input checkout-input-full"
                        />
                    </div>

                    {/* Place Order Button */}
                    <button
                        type="submit"
                        disabled={loading || !isAddressValid}
                        className="checkout-submit-btn"
                    >
                        {loading ? "Placing Order..." : "Place Order (COD)"}
                    </button>
                </form>
            </div>
        </div>
    );
}
