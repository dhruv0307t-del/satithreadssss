"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useCheckoutModal } from "@/app/context/CheckoutModalContext";
import { useSession } from "next-auth/react";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { useRouter } from "next/navigation";
import { X, Truck, Zap } from "lucide-react";
import { calculateShippingFee, SHIPPING_REGIONS } from "@/app/lib/shipping";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

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

    const [isExpress, setIsExpress] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [fetchingAddresses, setFetchingAddresses] = useState(false);
    const [saveAddress, setSaveAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE" | "UPI">("COD");

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

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

    // Fetch saved addresses
    useEffect(() => {
        if (isOpen && status === "authenticated") {
            const fetchAddresses = async () => {
                setFetchingAddresses(true);
                try {
                    const res = await fetch("/api/user/address");
                    const data = await res.json();
                    if (data.success) {
                        setSavedAddresses(data.addresses);
                        // If there's a default address, auto-fill
                        const defaultAddr = data.addresses.find((a: any) => a.isDefault);
                        if (defaultAddr) {
                            setAddress({
                                name: defaultAddr.name,
                                phone: defaultAddr.phone,
                                address: defaultAddr.address,
                                city: defaultAddr.city,
                                state: defaultAddr.state,
                                pincode: defaultAddr.pincode,
                            });
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch addresses", err);
                } finally {
                    setFetchingAddresses(false);
                }
            };
            fetchAddresses();
        }
    }, [isOpen, status]);

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [couponDetails, setCouponDetails] = useState<any>(null);
    const [couponError, setCouponError] = useState("");

    // Validation
    const isAddressValid = Object.values(address).every((v) => v.trim() !== "");

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

    // Calculate shipping fee whenever address or subtotal changes
    useEffect(() => {
        const fee = calculateShippingFee(subtotal, address.city, address.state, isExpress);
        setShippingFee(fee);
    }, [subtotal, address.city, address.state, isExpress]);

    const grandTotal = finalTotal + shippingFee;

    const placeOrder = async () => {
        if (!isAddressValid) {
            setError("Please fill all address fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Place order
            const res = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    shippingAddress: address,
                    paymentMethod: paymentMethod,
                    couponCode: couponDetails?.code,
                    discountAmount: subtotal - finalTotal,
                    shippingFee,
                    isExpress,
                    totalAmount: grandTotal,
                }),
            });

            const contentType = res.headers.get("content-type");
            if (!res.ok || !contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Server Error Response:", text);
                throw new Error(`Server Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();

            if (data.success) {
                // Save address if requested
                if (status === "authenticated" && saveAddress) {
                    fetch("/api/user/address", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(address),
                    });
                }

                if (paymentMethod === "ONLINE" || paymentMethod === "UPI") {
                    if (!(window as any).Razorpay) {
                        setError("Razorpay SDK not loaded. Please refresh the page.");
                        setLoading(false);
                        return;
                    }
                    const options = {
                        key: data.razorpayKeyId,
                        amount: Math.round(data.totalAmount * 100),
                        currency: "INR",
                        name: "Sati Threads",
                        description: "Order Payment",
                        order_id: data.razorpayOrderId,
                        handler: async function (response: any) {
                            // Verify payment on backend
                            const verifyRes = await fetch("/api/verify-payment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    orderId: data.orderId,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            });
                            const verifyData = await verifyRes.json();
                            if (verifyData.success) {
                                clearCart();
                                closeModal();
                                resetForm();
                                router.push(`/orders/${data.orderId}`);
                            } else {
                                setError("Payment verification failed. Please contact support.");
                            }
                        },
                        prefill: {
                            name: address.name,
                            contact: address.phone,
                            email: session?.user?.email || "",
                            method: paymentMethod === "UPI" ? "upi" : undefined
                        },
                        theme: {
                            color: "#3A6B50",
                        },
                    };
                    const rzp = new (window as any).Razorpay(options);
                    rzp.open();
                } else {
                    // COD Success
                    clearCart();
                    closeModal();
                    resetForm();
                    router.push(`/orders/${data.orderId}`);
                }
            } else {
                setError(data.message || "Order failed");
            }
        } catch (err: any) {
            console.error("Checkout Error:", err);
            setError(err.message || "Something went wrong. Please try again.");
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
        setIsExpress(false);
        setShippingFee(0);
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

    if (!isOpen) return null;

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

                {/* Shipping Address Form */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3
                        style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            margin: 0,
                            color: "#1A202C",
                        }}
                    >
                        Shipping Address
                    </h3>
                    {savedAddresses.length > 0 && (
                        <select
                            onChange={(e) => {
                                const selected = savedAddresses.find(a => a._id === e.target.value);
                                if (selected) {
                                    setAddress({
                                        name: selected.name,
                                        phone: selected.phone,
                                        address: selected.address,
                                        city: selected.city,
                                        state: selected.state,
                                        pincode: selected.pincode,
                                    });
                                }
                            }}
                            style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "14px" }}
                        >
                            <option value="">Use Saved Address</option>
                            {savedAddresses.map(a => (
                                <option key={a._id} value={a._id}>{a.name} - {a.city}</option>
                            ))}
                        </select>
                    )}
                </div>

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

                        {/* State Dropdown */}
                        <select
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className="checkout-input"
                            style={{ backgroundColor: "#fff" }}
                        >
                            <option value="">Select State</option>
                            {INDIAN_STATES.sort().map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        {/* Pincode - Full Width */}
                        <input
                            type="text"
                            placeholder="Pincode"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            className="checkout-input checkout-input-full"
                        />
                    </div>

                    {/* Save address checkbox (only for logged-in users) */}
                    {status === "authenticated" && (
                        <label style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0 0", cursor: "pointer", userSelect: "none", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${saveAddress ? "rgba(58,107,80,0.3)" : "#E5E7EB"}`, background: saveAddress ? "#EAF4EE" : "#fff", transition: "all 0.15s" }}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${saveAddress ? "#3A6B50" : "#D1D5DB"}`, background: saveAddress ? "#3A6B50" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0 }} onClick={() => setSaveAddress(!saveAddress)}>
                                {saveAddress && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                            </div>
                            <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} style={{ display: "none" }} />
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A14" }}>Save this address for later</div>
                                <div style={{ fontSize: 11.5, color: "#6B7060", marginTop: 1 }}>Add to your saved addresses in My Profile</div>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={saveAddress ? "#3A6B50" : "#9CA3AF"} strokeWidth="2" style={{ marginLeft: "auto", flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        </label>
                    )}

                    {/* Payment Method */}
                    <div style={{ margin: "24px 0" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#1A202C" }}>Payment Method</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
                            {[
                                { id: "COD", label: "Cash on Delivery", icon: "💵" },
                                { id: "UPI", label: "UPI (Google Pay/PhonePe)", icon: "📱" },
                                { id: "ONLINE", label: "Other Online (Card/Net)", icon: "💳" }
                            ].map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id as any)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "14px",
                                        borderRadius: "12px",
                                        border: `2px solid ${paymentMethod === method.id ? "#3A6B50" : "#E5E7EB"}`,
                                        backgroundColor: paymentMethod === method.id ? "#F0FDF4" : "#fff",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <div style={{
                                        width: "18px",
                                        height: "18px",
                                        borderRadius: "50%",
                                        border: `2px solid ${paymentMethod === method.id ? "#3A6B50" : "#D1D5DB"}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: paymentMethod === method.id ? "#3A6B50" : "transparent"
                                    }}>
                                        {paymentMethod === method.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#fff" }} />}
                                    </div>
                                    <span style={{ fontWeight: "600", fontSize: "14px", color: "#1A202C" }}>{method.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Option */}
                    <div style={{ margin: "24px 0" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#1A202C" }}>Delivery Method</h3>
                        <div
                            onClick={() => setIsExpress(!isExpress)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "16px",
                                borderRadius: "12px",
                                border: `2px solid ${isExpress ? "#3A6B50" : "#E5E7EB"}`,
                                backgroundColor: isExpress ? "#F0FDF4" : "#fff",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <div style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                border: `2px solid ${isExpress ? "#3A6B50" : "#D1D5DB"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: isExpress ? "#3A6B50" : "transparent"
                            }}>
                                {isExpress && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fff" }} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Zap size={16} color="#3A6B50" fill="#3A6B50" />
                                    <span style={{ fontWeight: "600", color: "#1A202C" }}>Express Delivery</span>
                                </div>
                                <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>Extra Rs. 50 will be charged. Faster delivery guaranteed.</p>
                            </div>
                            <span style={{ fontWeight: "600", color: "#3A6B50" }}>+Rs. 50</span>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-order-summary" style={{ background: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#1A202C" }}>Order Summary</h3>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ color: "#6B7280" }}>Items ({cart.length})</span>
                            <span style={{ fontWeight: "500" }}>Rs. {subtotal.toFixed(2)}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ color: "#6B7280" }}>Shipping Fee</span>
                                {!address.state && <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Select state to calculate</span>}
                            </div>
                            <span style={{ fontWeight: "500", color: shippingFee === (isExpress ? 50 : 0) ? "#059669" : "#1A202C" }}>
                                {shippingFee === (isExpress ? 50 : 0) ? (isExpress ? "Rs. 50.00 (Express)" : "FREE") : `Rs. ${shippingFee.toFixed(2)}`}
                            </span>
                        </div>

                        {/* Coupon Logic */}
                        <div style={{ margin: "16px 0", display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                placeholder="Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                style={{ flex: 1, padding: "10px", border: "1px solid #D1D5DB", borderRadius: "8px" }}
                            />
                            <button onClick={(e) => { e.preventDefault(); validateCoupon(); }} style={{ padding: "10px 20px", backgroundColor: "#333", color: "#fff", borderRadius: "8px", fontWeight: "600" }}>Apply</button>
                        </div>
                        {couponError && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{couponError}</p>}
                        {couponDetails && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "green" }}>
                                <span>Discount ({couponDetails.code})</span>
                                <span>- Rs. {(subtotal - finalTotal).toFixed(2)}</span>
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #E5E7EB", fontWeight: "700", fontSize: "20px", color: "#3A6B50" }}>
                            <span>Total Payable</span>
                            <span>Rs. {grandTotal.toFixed(2)}</span>
                        </div>
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
