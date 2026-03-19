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
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    // Reviews State
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Priya S.",
            initial: "P",
            avatarColor: "#3A6B50",
            rating: 5,
            date: "2 days ago",
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
            size: "M",
            fit: "True to Size",
            verified: true,
            isTopReview: false,
            title: "Absolutely love the quality!",
            body: "Absolutely love this outfit! The fabric quality is amazing and the fit is perfect. Highly recommend! The colour is exactly as shown in the pictures and it arrived beautifully packaged.",
            helpful: 12,
            productTag: "Genda Phool Kurti",
            voted: false
        },
        {
            id: 2,
            name: "Ananya V.",
            initial: "A",
            avatarColor: "#9B6B3A",
            rating: 5,
            date: "7 days ago",
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
            size: "L",
            fit: "True to Size",
            verified: false,
            isTopReview: true,
            title: "Perfect festive outfit!",
            body: "Wore this to a family function and received so many compliments. The embroidery detail is exquisite and the fabric is breathable even in summer heat. Will definitely order more!",
            helpful: 8,
            productTag: "Gulabo Suit Set",
            voted: false
        },
        {
            id: 3,
            name: "Neha T.",
            initial: "N",
            avatarColor: "#5D6B9B",
            rating: 4,
            date: "14 days ago",
            timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
            size: "S",
            fit: "Runs Small",
            verified: true,
            isTopReview: false,
            title: "Great quality, size runs a bit small",
            body: "Beautiful kurta — the print is stunning and the fabric is soft. Only feedback is that it runs slightly small so I'd suggest sizing up. Apart from that, very happy with the purchase!",
            helpful: 3,
            productTag: "Morni Kurti",
            voted: false
        }
    ]);

    const [activeFilter, setActiveFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Form State
    const [formRating, setFormRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        title: "",
        body: "",
        size: "",
        fit: ""
    });

    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formRating === 0) return alert("Please select a star rating");
        if (!formData.name || !formData.email || !formData.body) return alert("Please fill in all required fields");

        const initial = formData.name[0].toUpperCase();
        const colors = ['#3A6B50', '#9B6B3A', '#5D6B9B', '#6B9B5D', '#9B3A5D'];
        const avatarColor = colors[Math.floor(Math.random() * colors.length)];

        const newReviewObj = {
            id: Date.now(),
            name: formData.name,
            initial,
            avatarColor,
            rating: formRating,
            date: "Just now",
            timestamp: Date.now(),
            size: formData.size,
            fit: formData.fit,
            verified: false,
            isTopReview: false,
            title: formData.title || "My Review",
            body: formData.body,
            helpful: 0,
            productTag: product.name,
            voted: false
        };

        setReviews([newReviewObj, ...reviews]);
        setIsReviewFormOpen(false);
        setFormRating(0);
        setFormData({ name: "", email: "", title: "", body: "", size: "", fit: "" });
    };

    const markHelpful = (id: number) => {
        setReviews(reviews.map(r => {
            if (r.id === id && !r.voted) {
                return { ...r, helpful: r.helpful + 1, voted: true };
            }
            return r;
        }));
    };

    const filteredReviews = reviews
        .filter(r => {
            if (activeFilter === "all") return true;
            if (activeFilter === "verified") return r.verified;
            return r.rating === parseInt(activeFilter);
        })
        .sort((a, b) => {
            if (sortBy === "highest") return b.rating - a.rating;
            if (sortBy === "lowest") return a.rating - b.rating;
            if (sortBy === "helpful") return b.helpful - a.helpful;
            return b.timestamp - a.timestamp;
        });

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
                <Link href="/">Home</Link>
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
                            <div className="feature-icon">🔄</div>
                            <div className="feature-title">No Return</div>
                            <div className="feature-text">Only exchange available</div>
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
                                    href={`/products/${rec._id}`}
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

            {/* Premium Reviews Section */}
            <div className="premium-reviews-container">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .premium-reviews-container {
                        --bg: #F2EFE0;
                        --card: transparent; /* No card background to blend better */
                        --green: #3A6B50;
                        --green-pale: #EAF4EE;
                        --gold: #B8860B;
                        --gold-blend: #C69727; 
                        --gold-pale: #FBF3DC;
                        --text: #1A1A14;
                        --text-sub: #6B7060;
                        --border: rgba(58,107,80,0.06); /* Very subtle border */
                        --shadow: none; /* No shadow to remove layering */
                        --shadow-lg: none; 
                        --red: #C0392B;
                        --radius: 20px;
                        --radius-sm: 12px;
                        --font-accent: 'Cormorant Garamond', serif;
                        --font-base: 'DM Sans', sans-serif;
                    }

                    .reviews-section {
                        max-width: 960px;
                        margin: 60px auto;
                        padding: 0 24px;
                        font-family: var(--font-base);
                    }

                    .reviews-header {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 20px;
                        flex-wrap: wrap;
                        margin-bottom: 28px;
                    }

                    .reviews-header-left h2 {
                        font-family: var(--font-accent);
                        font-size: 36px;
                        font-weight: 600;
                        color: var(--text);
                        letter-spacing: -0.5px;
                        margin-bottom: 10px;
                    }

                    .overall-rating {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        flex-wrap: wrap;
                    }

                    .rating-big {
                        font-family: var(--font-accent);
                        font-size: 52px;
                        font-weight: 600;
                        color: var(--gold);
                        line-height: 1;
                        letter-spacing: -2px;
                    }

                    .rating-big-detail {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }

                    .stars-row {
                        display: flex;
                        gap: 3px;
                    }

                    .star-icon {
                        font-size: 18px;
                    }

                    .rating-count {
                        font-size: 13px;
                        color: var(--text-sub);
                    }

                    .rating-bars {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                        margin-top: 16px;
                    }

                    .rating-bar-row {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 12px;
                        color: var(--text-sub);
                    }

                    .rating-bar-row span:first-child {
                        width: 8px;
                        text-align: right;
                    }

                    .bar-track {
                        flex: 1;
                        height: 6px;
                        background: rgba(184,134,11,0.1);
                        border-radius: 99px;
                        overflow: hidden;
                    }

                    .bar-fill {
                        height: 100%;
                        border-radius: 99px;
                        background: var(--gold-blend); /* Solid color instead of gradient for flatter look */
                        transition: width 1s ease;
                    }

                    .bar-count {
                        width: 20px;
                        text-align: left;
                    }

                    .btn-write-review {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 24px;
                        border-radius: 99px;
                        background: var(--green);
                        color: #fff;
                        font-family: var(--font-base);
                        font-size: 13px;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s;
                        white-space: nowrap;
                        flex-shrink: 0;
                        margin-top: 6px;
                    }

                    .btn-write-review:hover {
                        background: #2e5640;
                        transform: translateY(-1px);
                    }

                    .review-form-card {
                        border-radius: var(--radius);
                        padding: 28px 30px;
                        border: 1px solid var(--border);
                        margin-bottom: 24px;
                        animation: slideDown 0.35s cubic-bezier(.34,1.2,.64,1);
                    }

                    @keyframes slideDown {
                        from { opacity:0; transform: translateY(-10px); }
                        to { opacity:1; transform: translateY(0); }
                    }

                    .form-title {
                        font-family: var(--font-accent);
                        font-size: 22px;
                        font-weight: 600;
                        color: var(--text);
                        margin-bottom: 22px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .form-close {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background: var(--bg);
                        border: 1px solid var(--border);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        color: var(--text-sub);
                        transition: all 0.15s;
                    }

                    .form-close:hover {
                        background: var(--green);
                        color: #fff;
                        border-color: var(--green);
                    }

                    .form-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 14px;
                        margin-bottom: 14px;
                    }

                    .form-field {
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                    }

                    .form-field.full {
                        grid-column: 1 / -1;
                    }

                    .form-field label {
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--text);
                    }

                    .form-field label .req {
                        color: var(--red);
                        margin-left: 2px;
                    }

                    .form-field input, .form-field textarea, .form-field select {
                        width: 100%;
                        padding: 11px 14px;
                        border-radius: var(--radius-sm);
                        border: 1.5px solid var(--border);
                        background: #FAFAF7;
                        font-family: var(--font-base);
                        font-size: 13.5px;
                        color: var(--text);
                        outline: none;
                        transition: border-color 0.17s, box-shadow 0.17s, background 0.17s;
                    }

                    .form-field input:focus, .form-field textarea:focus, .form-field select:focus {
                        border-color: var(--green);
                        background: #fff;
                        box-shadow: 0 0 0 3px rgba(58,107,80,0.08);
                    }

                    .form-field textarea {
                        resize: vertical;
                        min-height: 110px;
                        line-height: 1.55;
                    }

                    .star-picker {
                        display: flex;
                        flex-direction: column;
                        gap: 7px;
                    }

                    .star-picker label {
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--text);
                    }

                    .star-input-row {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }

                    .star-input-item {
                        font-size: 30px;
                        cursor: pointer;
                        line-height: 1;
                        filter: grayscale(1) opacity(.35);
                        transition: filter 0.15s, transform 0.15s;
                        user-select: none;
                    }

                    .star-input-item:hover,
                    .star-input-item.active {
                        filter: none;
                        transform: scale(1.15);
                    }

                    .rating-text {
                        font-size: 12px;
                        color: var(--text-sub);
                        margin-left: 8px;
                        font-style: italic;
                    }

                    .field-footer {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 3px;
                    }

                    .char-count {
                        font-size: 11px;
                        color: var(--text-sub);
                    }

                    .form-actions {
                        display: flex;
                        gap: 10px;
                        margin-top: 4px;
                    }

                    .btn-submit {
                        padding: 12px 28px;
                        border-radius: 99px;
                        background: var(--green);
                        color: #fff;
                        font-family: var(--font-base);
                        font-size: 13px;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                        transition: all 0.18s;
                        box-shadow: 0 3px 12px rgba(58,107,80,0.22);
                        display: flex;
                        align-items: center;
                        gap: 7px;
                    }

                    .btn-submit:hover {
                        background: #2e5640;
                        transform: translateY(-1px);
                    }

                    .btn-cancel {
                        padding: 12px 22px;
                        border-radius: 99px;
                        background: transparent;
                        color: var(--text-sub);
                        font-family: var(--font-base);
                        font-size: 13px;
                        font-weight: 500;
                        border: 1.5px solid var(--border);
                        cursor: pointer;
                        transition: all 0.15s;
                    }

                    .btn-cancel:hover {
                        border-color: var(--green);
                        color: var(--green);
                    }

                    .filter-bar {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        flex-wrap: wrap;
                        margin-bottom: 20px;
                    }

                    .filter-label {
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--text-sub);
                    }

                    .filter-pill {
                        padding: 6px 14px;
                        border-radius: 99px;
                        font-family: var(--font-base);
                        font-size: 12px;
                        font-weight: 500;
                        cursor: pointer;
                        border: 1.5px solid var(--border);
                        background: var(--card);
                        color: var(--text-sub);
                        transition: all 0.15s;
                    }

                    .filter-pill:hover {
                        border-color: var(--green);
                        color: var(--green);
                    }

                    .filter-pill.active {
                        background: var(--green);
                        color: #fff;
                        border-color: var(--green);
                    }

                    .filter-sep {
                        flex: 1;
                    }

                    .sort-select {
                        padding: 7px 14px;
                        border-radius: 99px;
                        font-family: var(--font-base);
                        font-size: 12px;
                        border: 1.5px solid var(--border);
                        background: var(--card);
                        color: var(--text-sub);
                        outline: none;
                        cursor: pointer;
                        appearance: none;
                    }

                    .reviews-list {
                        display: flex;
                        flex-direction: column;
                        gap: 14px;
                    }

                    .review-card {
                        padding: 30px 0;
                        border-bottom: 1.5px solid var(--border); /* Bottom separator instead of full card */
                        transition: border-color 0.2s;
                        position: relative;
                        animation: fadeUp 0.4s ease both;
                    }

                    @keyframes fadeUp {
                        from { opacity:0; transform:translateY(10px); }
                        to { opacity:1; transform:translateY(0); }
                    }

                    .review-card:hover {
                        border-bottom-color: var(--gold);
                    }

                    .review-card-top {
                        display: flex;
                        align-items: flex-start;
                        justify-content: space-between;
                        gap: 12px;
                        margin-bottom: 12px;
                    }

                    .reviewer-info {
                        display: flex;
                        align-items: center;
                        gap: 11px;
                    }

                    .reviewer-avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: #fff;
                        flex-shrink: 0;
                    }

                    .reviewer-name {
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--text);
                    }

                    .reviewer-meta {
                        font-size: 11.5px;
                        color: var(--text-sub);
                        margin-top: 2px;
                    }

                    .review-stars {
                        display: flex;
                        gap: 2px;
                    }

                    .review-star {
                        font-size: 15px;
                    }

                    .review-badge {
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        padding: 3px 9px;
                        border-radius: 99px;
                        flex-shrink: 0;
                    }

                    .badge-verified {
                        background: var(--green-pale);
                        color: var(--green);
                        border: 1px solid rgba(58,107,80,0.2);
                    }

                    .badge-top {
                        background: var(--gold-pale);
                        color: var(--gold);
                        border: 1px solid rgba(184,134,11,0.2);
                    }

                    .review-title {
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--text);
                        margin-bottom: 6px;
                    }

                    .review-body {
                        font-size: 13.5px;
                        color: var(--text-sub);
                        line-height: 1.65;
                        margin-bottom: 14px;
                    }

                    .review-footer {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex-wrap: wrap;
                    }

                    .helpful-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 5px;
                        padding: 5px 14px;
                        border-radius: 99px;
                        background: var(--bg);
                        border: 1.5px solid var(--border);
                        font-family: var(--font-base);
                        font-size: 12px;
                        font-weight: 500;
                        color: var(--text-sub);
                        cursor: pointer;
                        transition: all 0.15s;
                    }

                    .helpful-btn:hover {
                        border-color: var(--gold);
                        color: var(--gold);
                        background: var(--gold-pale);
                    }

                    .helpful-btn.voted {
                        background: var(--gold-pale);
                        color: var(--gold);
                        border-color: rgba(184,134,11,0.35);
                    }

                    .report-btn {
                        font-size: 11.5px;
                        color: #C0C4B8;
                        background: none;
                        border: none;
                        cursor: pointer;
                        font-family: var(--font-base);
                        transition: color 0.15s;
                    }

                    .report-btn:hover {
                        color: var(--red);
                    }

                    .review-product-tag {
                        font-size: 11px;
                        color: var(--text-sub);
                        background: var(--bg);
                        border: 1px solid var(--border);
                        border-radius: 6px;
                        padding: 2px 8px;
                        margin-left: auto;
                    }

                    .view-more-wrap {
                        text-align: center;
                        margin-top: 24px;
                    }

                    .btn-view-more {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 30px;
                        border-radius: 99px;
                        background: transparent;
                        color: var(--green);
                        font-family: var(--font-base);
                        font-size: 13px;
                        font-weight: 600;
                        border: 1.5px solid rgba(58,107,80,0.3);
                        cursor: pointer;
                        transition: all 0.18s;
                    }

                    .btn-view-more:hover {
                        background: var(--green-pale);
                        border-color: var(--green);
                    }

                    @media (max-width: 600px) {
                        .form-grid { grid-template-columns: 1fr; }
                        .reviews-header { flex-direction: column; }
                        .filter-sep { display: none; }
                        .rating-big { font-size: 42px; }
                        .reviews-header-left h2 { font-size: 28px; }
                    }
                ` }} />

                <div className="reviews-section">
                    <div className="reviews-header">
                        <div className="reviews-header-left">
                            <h2>Customer Reviews</h2>
                            <div className="overall-rating">
                                <div className="rating-big">4.7</div>
                                <div className="rating-big-detail">
                                    <div className="stars-row">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="var(--gold)" style={{ opacity: s === 5 ? 0.3 : 1 }}>
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <div className="rating-count">Based on {reviews.length} reviews</div>
                                </div>
                            </div>

                            <div className="rating-bars">
                                {[5, 4, 3, 2, 1].map(num => {
                                    const count = reviews.filter(r => r.rating === num).length;
                                    const percentage = (count / reviews.length) * 100;
                                    return (
                                        <div key={num} className="rating-bar-row">
                                            <span>{num}</span>
                                            <div className="bar-track">
                                                <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                            <span className="bar-count">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {!isReviewFormOpen && (
                            <button className="btn-write-review" onClick={() => setIsReviewFormOpen(true)}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Write a Review
                            </button>
                        )}
                    </div>

                    {isReviewFormOpen && (
                        <div className="review-form-card" id="reviewForm">
                            <div className="form-title">
                                Share Your Experience
                                <button className="form-close" onClick={() => setIsReviewFormOpen(false)}>✕</button>
                            </div>

                            <div className="star-picker" style={{ marginBottom: "18px" }}>
                                <label>Your Rating <span style={{ color: "var(--red)" }}>*</span></label>
                                <div className="star-input-row" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <div
                                            key={num}
                                            className={`star-input-item ${(hoverRating || formRating) >= num ? 'active' : ''}`}
                                            onMouseEnter={() => setHoverRating(num)}
                                            onClick={() => setFormRating(num)}
                                            style={{ display: 'flex' }}
                                        >
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--gold)">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        </div>
                                    ))}
                                    <span className="rating-text">
                                        {formRating > 0 ? `${ratingLabels[formRating]} — selected` : (hoverRating > 0 ? ratingLabels[hoverRating] : 'Tap to rate')}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleFormSubmit}>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Full Name <span className="req">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Email <span className="req">*</span></label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field full">
                                        <label>Review Title</label>
                                        <input
                                            type="text"
                                            placeholder="Summarise your experience in one line…"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-field full">
                                        <label>Your Review <span className="req">*</span></label>
                                        <textarea
                                            maxLength={500}
                                            placeholder="Tell others what you liked or didn't like — fabric quality, fit, delivery, etc."
                                            required
                                            value={formData.body}
                                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                        ></textarea>
                                        <div className="field-footer">
                                            <span className="char-count">{formData.body.length} / 500</span>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label>Size Purchased</label>
                                        <select
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        >
                                            <option value="">Select size</option>
                                            <option>XS</option><option>S</option><option>M</option>
                                            <option>L</option><option>XL</option><option>XXL</option>
                                            <option>3XL</option><option>Free Size</option>
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>How was the fit?</label>
                                        <select
                                            value={formData.fit}
                                            onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            <option>Runs Small</option><option>True to Size</option><option>Runs Large</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-submit">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Submit Review
                                    </button>
                                    <button type="button" className="btn-cancel" onClick={() => setIsReviewFormOpen(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="filter-bar">
                        <span className="filter-label">Filter:</span>
                        <button
                            className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            All ({reviews.length})
                        </button>
                        <button
                            className={`filter-pill ${activeFilter === '5' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('5')}
                        >
                            ⭐⭐⭐⭐⭐
                        </button>
                        <button
                            className={`filter-pill ${activeFilter === '4' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('4')}
                        >
                            ⭐⭐⭐⭐
                        </button>
                        <button
                            className={`filter-pill ${activeFilter === 'verified' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('verified')}
                        >
                            Verified
                        </button>
                        <div className="filter-sep"></div>
                        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Newest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                            <option value="helpful">Most Helpful</option>
                        </select>
                    </div>

                    <div className="reviews-list">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-card-top">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar" style={{ background: review.avatarColor }}>{review.initial}</div>
                                        <div>
                                            <div className="reviewer-name">{review.name}</div>
                                            <div className="reviewer-meta">
                                                {review.date}
                                                {review.size && ` · Size ${review.size}`}
                                                {review.fit && ` · ${review.fit}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                        <div className="review-stars">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" style={{ opacity: s > review.rating ? 0.2 : 1 }}>
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        {review.verified && <span className="review-badge badge-verified">✓ Verified</span>}
                                        {review.isTopReview && <span className="review-badge badge-top">🏆 Top Review</span>}
                                    </div>
                                </div>
                                <div className="review-title">{review.title}</div>
                                <p className="review-body">{review.body}</p>
                                <div className="review-footer">
                                    <button
                                        className={`helpful-btn ${review.voted ? 'voted' : ''}`}
                                        onClick={() => markHelpful(review.id)}
                                    >
                                        👍 Helpful <span className="helpful-count">({review.helpful})</span>
                                    </button>
                                    <button className="report-btn">Report</button>
                                    <div className="review-product-tag">{review.productTag}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="view-more-wrap">
                        <button className="btn-view-more">
                            View All Reviews
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}
