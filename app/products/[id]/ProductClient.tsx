"use client";

import { useState, useRef, useEffect } from "react";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { toggleLiked } from "@/app/actions/user";
import { useRouter } from "next/navigation";

// Define a type for recommendations if not available elsewhere
interface Recommendation {
    _id: string;
    name: string;
    priceNew: number;
    priceOld?: number;
    mainImage: string;
}

interface ProductClientProps {
    product: any;
    recommendations?: Recommendation[];
}

export default function ProductClient({ product, recommendations = [] }: ProductClientProps) {
    const router = useRouter();
    const { addToCart, openCart } = useCart();

    // State
    const [selectedImage, setSelectedImage] = useState(
        product?.mainImage || (product?.gridImages?.[0]) || "/placeholder.jpg"
    );
    const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]?.size || product?.sizes?.[0] || "");
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // UI State
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Refs for Zoom
    const mainImageContainerRef = useRef<HTMLDivElement>(null);
    const mainImageRef = useRef<HTMLImageElement>(null);
    const lensRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const zoomImageRef = useRef<HTMLImageElement>(null);

    // Zoom Logic
    useEffect(() => {
        const container = mainImageContainerRef.current;
        const img = mainImageRef.current; // access underlying img if possible, or bind to container
        const lens = lensRef.current;
        const result = resultRef.current;
        const zoomImg = zoomImageRef.current;

        if (!container || !lens || !result || !zoomImg) return;

        const moveLens = (e: MouseEvent) => {
            e.preventDefault();

            // Get dimensions
            const containerRect = container.getBoundingClientRect();
            // Since next/image is used, the actual image element might be different, 
            // but relying on container for dimensions is safer for layout.
            // We assume container has the aspect ratio.

            // resultRect will now be valid as CSS :hover makes it block
            const resultRect = result.getBoundingClientRect();
            const lensRect = lens.getBoundingClientRect();

            // Calculate ratio
            // HTML logic: cx = result.offsetWidth / lens.offsetWidth;
            const cx = resultRect.width / lensRect.width;
            const cy = resultRect.height / lensRect.height;

            // Assuming the image inside container fills it (object-fit: cover)
            const imgWidth = containerRect.width;
            const imgHeight = containerRect.height;

            // Set zoom image size
            zoomImg.style.width = (imgWidth * cx) + "px";
            zoomImg.style.height = (imgHeight * cy) + "px";

            // Calculate lens position (relative to viewport, needed relative to container)
            // Cursor position
            const xPos = e.clientX - containerRect.left;
            const yPos = e.clientY - containerRect.top;

            let x = xPos - (lensRect.width / 2);
            let y = yPos - (lensRect.height / 2);

            // Boundaries
            if (x > imgWidth - lensRect.width) x = imgWidth - lensRect.width;
            if (x < 0) x = 0;
            if (y > imgHeight - lensRect.height) y = imgHeight - lensRect.height;
            if (y < 0) y = 0;

            // Apply positions
            lens.style.left = x + "px";
            lens.style.top = y + "px";

            // Move zoomed image
            zoomImg.style.left = "-" + (x * cx) + "px";
            zoomImg.style.top = "-" + (y * cy) + "px";
            result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px"; // Backup if using background
        };

        container.addEventListener('mousemove', moveLens);

        return () => {
            container.removeEventListener('mousemove', moveLens);
        };
    }, []); // Run once on mount

    // Filter valid images
    const allImages = [
        product?.mainImage,
        ...(product?.gridImages || [])
    ].filter(Boolean);

    const displayImages = allImages.length > 0 ? allImages : ["/placeholder.jpg"];
    const thumbnailsToShow = displayImages.length >= 4
        ? displayImages.slice(0, 4)
        : displayImages; // Simplified logic

    const handleAddToCart = () => {
        addToCart({
            id: product._id,
            title: product.name,
            price: product.priceNew,
            image: product.mainImage,
            size: typeof selectedSize === 'string' ? selectedSize : selectedSize?.size,
            qty: quantity,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
        openCart();
    };

    const handleBuyNow = () => {
        handleAddToCart();
        window.location.href = "/checkout";
    };

    const handleAddToWishlist = async () => {
        await toggleLiked(product._id);
        router.push("/my-orders?tab=liked");
    };

    const toggleAccordionItem = (section: string) => {
        setActiveAccordion((prev) => (prev === section ? null : section));
    };

    // Helper for color swatches
    const getColorHex = (colorName: string) => {
        const colors: { [key: string]: string } = {
            "Blue": "#6B9BD1",
            "Pink": "#FFB3BA",
            "Green": "#90C695",
            "Yellow": "#FFD97D",
            "Black": "#2d2d2d",
            "White": "#FFFFFF",
            "Red": "#E63946",
            "Purple": "#6C63FF",
            "Beige": "#F5F5DC",
            "Gold": "#FFD700"
        };
        return colors[colorName] || "#E5DDD3";
    };

    if (!product) return <div>Loading...</div>;

    const discountPercent = product.priceOld && product.priceNew
        ? Math.round(((product.priceOld - product.priceNew) / product.priceOld) * 100)
        : 0;

    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link href="/home">Home</Link>
                <span>/</span>
                <Link href={`/category/${product.categorySlug || "all"}`}>
                    {product.category || "Collection"}
                </Link>
                <span>/</span>
                <span className="current">{product.name}</span>
            </div>

            {/* Product Section */}
            <div className="product-container">
                {/* Image Gallery */}
                <div className="image-gallery">
                    <div
                        className="main-image-container"
                        id="imageZoomContainer"
                        ref={mainImageContainerRef}
                    >
                        {discountPercent > 0 && <span className="discount-badge">{discountPercent}% OFF</span>}

                        {/* Using standard img tag to respect the CSS aspect-ratio on the image element */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="main-image"
                            id="mainImage"
                            ref={mainImageRef}
                        />

                        <div
                            className="zoom-lens"
                            id="zoomLens"
                            ref={lensRef}
                        ></div>

                        <div
                            className="zoom-result"
                            id="zoomResult"
                            ref={resultRef}
                        >
                            {/* We use a regular img tag for the zoom result to easily manipulate styles without next/image wrapper restrictions */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={selectedImage}
                                alt="Zoomed"
                                id="zoomImage"
                                ref={zoomImageRef}
                            />
                        </div>
                    </div>

                    <div className="thumbnail-grid">
                        {thumbnailsToShow.map((img: string, idx: number) => (
                            <div
                                key={idx}
                                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                                onClick={() => setSelectedImage(img)}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>

                    <div className="price-section">
                        <span className="current-price">₹ {(product.priceNew || 0).toLocaleString()}</span>
                        {product.priceOld && (
                            <span className="original-price">₹ {product.priceOld.toLocaleString()}</span>
                        )}
                        <span className={`stock-status ${product.quantity > 0 ? "" : "out-of-stock"}`}>
                            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>

                    <p className="product-description">
                        {product.description || "Experience luxury and comfort with this beautifully crafted piece."}
                    </p>

                    {/* Special Offers */}
                    <div className="special-offers">
                        <div className="offers-title">🎁 Special Offers</div>
                        <div className="offer-item">
                            <span className="offer-text">Flat 10% OFF on Rs 3000+</span>
                            <span className="offer-code">SATI10</span>
                        </div>
                        <div className="offer-item">
                            <span className="offer-text">Flat 15% OFF on Rs 6000+</span>
                            <span className="offer-code">SATI15</span>
                        </div>
                    </div>

                    {/* Size Selector */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="size-section">
                            <div className="size-header">
                                <div className="size-label">Select Size</div>
                                <a href="#" className="size-guide">📏 Size Guide</a>
                            </div>
                            <div className="size-options">
                                {product.sizes.map((sizeItem: any) => {
                                    const size = typeof sizeItem === 'string' ? sizeItem : sizeItem.size;
                                    return (
                                        <div
                                            key={size}
                                            className={`size-option ${selectedSize === size ? "active" : ""}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Color Selector */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="size-section">
                            <div className="size-header">
                                <div className="size-label">Select Color</div>
                            </div>
                            <div className="color-options">
                                {product.colors.map((color: string) => (
                                    <div
                                        key={color}
                                        className={`color-option ${selectedColor === color ? "active" : ""}`}
                                        onClick={() => setSelectedColor(color)}
                                        style={{ "--color": getColorHex(color) } as React.CSSProperties}
                                    >
                                        <div className="color-swatch"></div>
                                        <span className="color-name">{color}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="quantity-section">
                        <div className="quantity-label">Quantity</div>
                        <div className="quantity-selector">
                            <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                            <div className="qty-display" id="qtyDisplay">{quantity}</div>
                            <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            className="btn btn-cart"
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            style={addedToCart ? { background: 'linear-gradient(135deg, #06D6A0 0%, #05B386 100%)', color: 'white' } : {}}
                        >
                            {addedToCart ? "✓ Added!" : "🛒 Add to Cart"}
                        </button>
                        <button
                            className="btn btn-buy"
                            onClick={handleBuyNow}
                            disabled={product.quantity === 0}
                        >
                            ⚡ Buy It Now
                        </button>
                        <button className="btn btn-wishlist" onClick={handleAddToWishlist}>
                            👁️ Wishlist
                        </button>
                    </div>

                    {/* Features */}
                    <div className="product-features">
                        <div className="feature">
                            <div className="feature-icon">🚚</div>
                            <div className="feature-title">Free Shipping</div>
                            <div className="feature-text">On orders above ₹999</div>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">↩️</div>
                            <div className="feature-title">Easy Returns</div>
                            <div className="feature-text">7 days return policy</div>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">✨</div>
                            <div className="feature-title">100% Authentic</div>
                            <div className="feature-text">Genuine products</div>
                        </div>
                    </div>

                    {/* Accordions */}
                    <div className="accordion-section">
                        <div className={`accordion-item ${activeAccordion === 'details' ? 'active' : ''}`}>
                            <button className="accordion-header" onClick={() => toggleAccordionItem('details')}>
                                <div className="accordion-title">Product & Size Details</div>
                                <div className="accordion-icon">▼</div>
                            </button>
                            <div className="accordion-content">
                                <div className="accordion-content-inner">
                                    <strong>Fabric:</strong> {product.fabric || "Premium Quality"}<br />
                                    <strong>Category:</strong> {product.category}<br />
                                    <p>Detailed product specifications and sizing information.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`accordion-item ${activeAccordion === 'care' ? 'active' : ''}`}>
                            <button className="accordion-header" onClick={() => toggleAccordionItem('care')}>
                                <div className="accordion-title">Wash Care Instructions</div>
                                <div className="accordion-icon">▼</div>
                            </button>
                            <div className="accordion-content">
                                <div className="accordion-content-inner">
                                    Machine wash cold with similar colors. Do not bleach.
                                </div>
                            </div>
                        </div>

                        <div className={`accordion-item ${activeAccordion === 'mfg' ? 'active' : ''}`}>
                            <button className="accordion-header" onClick={() => toggleAccordionItem('mfg')}>
                                <div className="accordion-title">Manufacturer Information</div>
                                <div className="accordion-icon">▼</div>
                            </button>
                            <div className="accordion-content">
                                <div className="accordion-content-inner">
                                    <strong>Manufactured by:</strong> Sati Threads Pvt. Ltd.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="product-container">
                    <div className="recommendations-section" style={{ gridColumn: "1 / -1" }}>
                        <div className="recommendations-header">
                            <h2 className="recommendations-title">You Might Also Like</h2>
                            <p className="recommendations-subtitle">Handpicked recommendations based on your style</p>
                        </div>

                        <div className="recommendations-grid">
                            {recommendations.map((rec) => (
                                <Link
                                    href={`/product/${rec._id}`}
                                    className="product-card"
                                    key={rec._id}
                                >
                                    <div className="product-image-container">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={rec.mainImage}
                                            alt={rec.name}
                                            className="product-image"
                                        />
                                    </div>
                                    <div className="product-card-info">
                                        <h3 className="product-card-title">{rec.name}</h3>
                                        <div className="product-card-price">₹ {(rec.priceNew || 0).toLocaleString()}</div>
                                        {/* Quick Add button logic would go here if needed to be interactive preventing Link navigation */}
                                        <button className="quick-add-btn">Quick Add</button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews Section - With proper dynamic hooks if needed, for now matching HTML structure */}
            <div className="product-container">
                <div className="reviews-section" style={{ gridColumn: "1 / -1" }}>
                    <div className="reviews-header">
                        <div>
                            <div className="reviews-title">Customer Reviews</div>
                            <div className="review-summary">
                                <span className="review-rating">4.7</span>
                                <span>out of 5 (3 reviews)</span>
                            </div>
                        </div>
                        <button className="write-review-btn" onClick={() => setIsReviewModalOpen(true)}>Write a Review</button>
                    </div>

                    <div className="reviews-preview">
                        {/* Static reviews meant to be dynamic in full implementation */}
                        <div className="review-card">
                            <div className="review-header-info">
                                <div>
                                    <div className="reviewer-name">Priya S.</div>
                                    <div className="review-date">2 days ago</div>
                                </div>
                            </div>
                            <div className="review-text">
                                Absolutely love this outfit! The fabric quality is amazing and the fit is perfect. Highly recommend!
                            </div>
                            <div className="review-helpful">
                                👍 Helpful (12)
                            </div>
                        </div>
                    </div>

                    <div className="view-all-reviews">
                        <button className="view-all-link" onClick={() => setIsReviewModalOpen(true)}>View All Reviews →</button>
                    </div>
                </div>
            </div>



            {/* Review Modal */}
            <div className={`modal ${isReviewModalOpen ? 'active' : ''}`} id="reviewModal" onClick={(e) => e.target === e.currentTarget && setIsReviewModalOpen(false)}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">All Reviews</h2>
                        <button className="modal-close" onClick={() => setIsReviewModalOpen(false)}>×</button>
                    </div>

                    <div className="all-reviews">
                        {/* Example dynamic reviews would map here */}
                        <div className="review-card">
                            <div className="review-text">More reviews would appear here...</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
