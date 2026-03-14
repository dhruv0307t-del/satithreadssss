"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { toggleWishlist, toggleLiked } from "@/app/actions/user";
import Image from "next/image";
import "../../my-orders.css";

export default function MyOrdersClient({ orders, wishlist, likedProducts }: any) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart, openCart } = useCart();
    const initialTab = searchParams.get("tab") || "orders";
    const [activeTab, setActiveTab] = useState(initialTab);

    // Update active tab if URL changes
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && ["orders", "wishlist", "liked"].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        // Update URL without refresh
        window.history.pushState({}, "", `?tab=${tab}`);
    };

    const toggleTracking = (e: React.MouseEvent) => {
        const btn = e.currentTarget;
        const card = btn.closest('.order-card');
        const details = card?.querySelector('.tracking-details');
        if (details) {
            details.classList.toggle('open');
            btn.textContent = details.classList.contains('open') ? 'Hide Tracking' : 'View Tracking';
        }
    };

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
        const btn = e.currentTarget;
        addToCart({
            id: product._id,
            title: product.name,
            price: product.priceNew,
            image: product.mainImage,
            qty: 1,
        });

        const originalText = btn.textContent;
        btn.textContent = '✓ Added!';
        (btn as HTMLElement).style.background = 'linear-gradient(135deg, #06D6A0 0%, #05B386 100%)';

        setTimeout(() => {
            btn.textContent = originalText;
            (btn as HTMLElement).style.background = '';
            openCart();
        }, 1000);
    };

    const handleRemoveFromWishlist = async (productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const btn = e.currentTarget;
        const card = btn.closest('.mo-product-card') as HTMLElement;

        if (card) {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
        }

        // Optimistic UI update - wait for animation
        setTimeout(async () => {
            await toggleWishlist(productId);
            router.refresh();
        }, 500);
    };

    const handleRemoveFromLiked = async (productId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const btn = e.currentTarget;
        const card = btn.closest('.mo-product-card') as HTMLElement;

        if (card) {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
        }

        setTimeout(async () => {
            await toggleLiked(productId);
            router.refresh();
        }, 500);
    };

    return (
        <>
            {/* Page Header */}
            <section className="page-header">
                <div className="section-image-heading">
                    <Image
                        src="/My Account.png"
                        alt="My Account"
                        width={1920}
                        height={200}
                        className="full-width-heading"
                    />
                </div>
            </section>

            {/* Main Content */}
            <div className="mo-container">
                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => handleTabChange('orders')}
                    >
                        My Orders
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
                        onClick={() => handleTabChange('wishlist')}
                    >
                        Wishlist
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
                        onClick={() => handleTabChange('liked')}
                    >
                        Liked Products
                    </button>
                </div>

                {/* Orders Tab */}
                <div className={`tab-content ${activeTab === 'orders' ? 'active' : ''}`} id="orders">
                    {orders && orders.length > 0 ? (
                        orders.map((order: any) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id-section">
                                        <div className="order-id">Order #{order._id.slice(-6).toUpperCase()}</div>
                                        <div className="order-date">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className={`order-status-badge ${order.orderStatus.toLowerCase()}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item: any, idx: number) => (
                                        <img key={idx} src={item.image} alt={item.name} className="order-item-image" />
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">Total: Rs. {order.totalAmount}</div>
                                    <button className="view-tracking-btn" onClick={toggleTracking}>
                                        View Tracking
                                    </button>
                                </div>

                                <div className="tracking-details">
                                    <div className="tracking-timeline">
                                        {/* Admin note / tracking info */}
                                        {(order.trackingNumber || order.trackingNote) && (
                                            <div style={{ background: '#EAF4EE', borderRadius: 10, padding: '10px 14px', marginBottom: 14, border: '1px solid rgba(58,107,80,0.15)' }}>
                                                {order.trackingNote && <div style={{ fontSize: 13, fontWeight: 600, color: '#3A6B50', marginBottom: order.trackingNumber ? 4 : 0 }}>{order.trackingNote}</div>}
                                                {order.trackingNumber && <div style={{ fontSize: 12, color: '#7A8070' }}>Tracking #: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1A1A14' }}>{order.trackingNumber}</span></div>}
                                            </div>
                                        )}
                                        {/* Tracking Steps */}
                                        <div className={`tracking-step completed`}>
                                            <div className="tracking-title">Order Placed</div>
                                            <div className="tracking-time">{new Date(order.createdAt).toLocaleString()}</div>
                                        </div>
                                        {['confirmed', 'processing', 'shipped', 'delivered'].some(s => order.orderStatus === s || ['processing', 'shipped', 'delivered'].includes(s) && ['processing', 'shipped', 'delivered'].indexOf(s) <= ['processing', 'shipped', 'delivered'].indexOf(order.orderStatus)) && (
                                            <div className={`tracking-step${['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus) ? ' completed' : ''}`}>
                                                <div className="tracking-title">Confirmed</div>
                                                <div className="tracking-time">Order confirmed</div>
                                            </div>
                                        )}
                                        {['processing', 'shipped', 'delivered'].includes(order.orderStatus) && (
                                            <div className="tracking-step completed">
                                                <div className="tracking-title">Processing</div>
                                                <div className="tracking-time">Order is being packed</div>
                                            </div>
                                        )}
                                        {['shipped', 'delivered'].includes(order.orderStatus) && (
                                            <div className="tracking-step completed">
                                                <div className="tracking-title">Shipped</div>
                                                <div className="tracking-time">{order.trackingNumber ? `In Transit · ${order.trackingNumber}` : 'In Transit'}</div>
                                            </div>
                                        )}
                                        {order.orderStatus === 'delivered' && (
                                            <div className="tracking-step completed">
                                                <div className="tracking-title">Delivered</div>
                                                <div className="tracking-time">Package Delivered 🎉</div>
                                            </div>
                                        )}
                                        {order.orderStatus === 'cancelled' && (
                                            <div className="tracking-step" style={{ color: '#C0392B' }}>
                                                <div className="tracking-title">Cancelled</div>
                                                <div className="tracking-time">{order.trackingNote || 'Order was cancelled'}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <h3 className="empty-state-title">No orders yet</h3>
                            <p className="empty-state-text">Start shopping to see your orders here.</p>
                            <Link href="/home" className="shop-now-btn">Shop Now</Link>
                        </div>
                    )}
                </div>

                {/* Wishlist Tab */}
                <div className={`tab-content ${activeTab === 'wishlist' ? 'active' : ''}`} id="wishlist">
                    <div className="mo-products-grid">
                        {wishlist && wishlist.length > 0 ? (
                            wishlist.map((p: any) => (
                                <div key={p._id} className="mo-product-card">
                                    <div className="mo-product-image-container">
                                        <button
                                            className="remove-wishlist-btn"
                                            onClick={(e) => handleRemoveFromWishlist(p._id, e)}
                                            title="Remove from Wishlist"
                                        >
                                            🗑️
                                        </button>
                                        <img src={p.mainImage} alt={p.name} className="mo-product-image" />
                                    </div>
                                    <div className="mo-product-info">
                                        <h3 className="mo-product-title">{p.name}</h3>
                                        <div className="mo-product-price">Rs. {p.priceNew}</div>
                                        <button
                                            className="move-to-cart-btn"
                                            onClick={(e) => handleAddToCart(p, e)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">👁️</div>
                                <h3 className="empty-state-title">Your wishlist is empty</h3>
                                <p className="empty-state-text">Start adding items you love!</p>
                                <Link href="/home" className="shop-now-btn">Shop Now</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Liked Products Tab */}
                <div className={`tab-content ${activeTab === 'liked' ? 'active' : ''}`} id="liked">
                    <div className="mo-products-grid">
                        {likedProducts && likedProducts.length > 0 ? (
                            likedProducts.map((p: any) => (
                                <div key={p._id} className="mo-product-card">
                                    <div className="mo-product-image-container">
                                        <button
                                            className="remove-wishlist-btn"
                                            onClick={(e) => handleRemoveFromLiked(p._id, e)}
                                            title="Remove from Liked"
                                        >
                                            💔
                                        </button>
                                        <img src={p.mainImage} alt={p.name} className="mo-product-image" />
                                    </div>
                                    <div className="mo-product-info">
                                        <h3 className="mo-product-title">{p.name}</h3>
                                        <div className="mo-product-price">Rs. {p.priceNew}</div>
                                        <button
                                            className="move-to-cart-btn"
                                            onClick={(e) => handleAddToCart(p, e)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">❤️</div>
                                <h3 className="empty-state-title">No liked products</h3>
                                <p className="empty-state-text">Heart items to save them here!</p>
                                <Link href="/home" className="shop-now-btn">Shop Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
