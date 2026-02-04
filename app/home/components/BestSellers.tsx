"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { toggleWishlist, toggleLiked } from "@/app/actions/user";

interface Product {
  _id: string;
  name: string;
  priceNew: number;
  priceOld?: number;
  mainImage: string;
  gridImages?: string[];
  sizes?: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Discount Calculation
  const discount =
    product.priceOld && product.priceNew
      ? Math.round(((product.priceOld - product.priceNew) / product.priceOld) * 100)
      : 0;

  // Secondary Image Logic
  const secondaryImage =
    product.gridImages && product.gridImages.length > 0
      ? product.gridImages[0]
      : product.mainImage;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) {
      alert("Please select a size");
      return;
    }

    setIsAdding(true);
    addToCart({
      id: product._id,
      title: product.name,
      price: product.priceNew,
      image: product.mainImage,
      qty: 1,
      size: selectedSize,
    });

    // Simulating "Added" state
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 1000);
  };

  return (
    <div className="bs-product-card group">
      {/* Image Container */}
      <div className="bs-product-image-container cursor-pointer">
        {discount > 0 ? (
          <span className="bs-product-badge sale">Sale</span>
        ) : (
          <span className="bs-product-badge new">New</span>
        )}

        <div onClick={() => router.push(`/product/${product._id}`)} className="relative w-full h-full">
          <Image
            src={product.mainImage || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="bs-product-image primary"
          />
          <Image
            src={secondaryImage || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="bs-product-image secondary"
          />
        </div>

        <div className="bs-quick-actions">
          <button
            className="bs-quick-action-btn"
            title="Quick View"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product._id}`);
            }}
          >
            👁️
          </button>
          <button
            className="bs-quick-action-btn"
            title="Add to Wishlist"
            onClick={async (e) => {
              e.stopPropagation();
              await toggleWishlist(product._id);
              router.push("/my-orders?tab=wishlist");
            }}
          >
            ❤️
          </button>
          <button
            className="bs-quick-action-btn"
            title="Add to Liked"
            onClick={async (e) => {
              e.stopPropagation();
              await toggleLiked(product._id);
              router.push("/my-orders?tab=liked");
            }}
          >
            ❤️
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bs-product-info">
        <h3
          className="bs-product-title line-clamp-1"
          onClick={() => router.push(`/product/${product._id}`)}
        >
          {product.name}
        </h3>

        <div className="bs-product-rating">
          <div className="bs-stars">★★★★★</div>
          <span className="bs-rating-count">(124)</span>
        </div>

        <div className="bs-product-price">
          <span className="bs-current-price">Rs. {product.priceNew}</span>
          {product.priceOld && (
            <>
              <span className="bs-original-price">Rs. {product.priceOld}</span>
              <span className="bs-discount-badge">{discount}% OFF</span>
            </>
          )}
        </div>

        <div className="bs-size-selector">
          <div className="bs-size-label">Select Size</div>
          <select
            className="bs-size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Select Size</option>
            {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <button
          className="bs-add-to-cart-btn"
          onClick={handleAddToCart}
          style={isAdding ? { background: 'linear-gradient(135deg, #06D6A0 0%, #05B386 100%)' } : {}}
        >
          {isAdding ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    fetch(`/api/products?isBestSeller=true&limit=8&t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(console.error);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420; // Card width + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };


  if (!products.length) return null;

  return (
    <section className="best-sellers-section">
      <div className="bs-container">
        {/* Header */}
        <div className="bs-section-header">
          <h2 className="bs-section-title">Our Best Sellers</h2>
          <p className="bs-section-subtitle">Curated Favorites</p>
        </div>

        {/* Products Scroll Wrapper with Navigation */}
        <div className="bs-products-scroll-wrapper">
          {/* Left Arrow */}
          <button className="bs-scroll-arrow left" onClick={() => scroll("left")}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Scrollable Container */}
          <div
            className="bs-products-scroll-container"
            id="productsContainer"
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="bs-products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button className="bs-scroll-arrow right" onClick={() => scroll("right")}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
