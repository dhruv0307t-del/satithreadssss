"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/app/actions/user";

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

  const discount =
    product.priceOld && product.priceNew
      ? Math.round(((product.priceOld - product.priceNew) / product.priceOld) * 100)
      : 0;

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

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 1000);
  };

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-image-wrapper">
        {discount > 0 ? (
          <span className="badge sale">Sale</span>
        ) : (
          <span className="badge new">New</span>
        )}

        <div
          onClick={() => router.push(`/products/${product._id}`)}
          className="image-container"
        >
          <Image
            src={product.mainImage || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="product-img primary"
          />
          <Image
            src={secondaryImage || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="product-img secondary"
          />
        </div>

        <div className="quick-actions">
          <button
            className="action-btn"
            title="Quick View"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${product._id}`);
            }}
          >
            👁️
          </button>
          <button
            className="action-btn"
            title="Add to Wishlist"
            onClick={async (e) => {
              e.stopPropagation();
              await toggleWishlist(product._id);
            }}
          >
            ❤️
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3
          className="product-name"
          onClick={() => router.push(`/products/${product._id}`)}
        >
          {product.name}
        </h3>

        <div className="rating">
          <div className="stars">★★★★★</div>
          <span className="rating-count">(124)</span>
        </div>

        <div className="price-row">
          <span className="current-price">Rs. {product.priceNew}</span>
          {product.priceOld && (
            <>
              <span className="old-price">Rs. {product.priceOld}</span>
              <span className="discount">{discount}% OFF</span>
            </>
          )}
        </div>

        <div className="size-section">
          <label className="size-label">Select Size</label>
          <select
            className="size-dropdown"
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
          className="add-cart-btn"
          onClick={handleAddToCart}
          style={
            isAdding
              ? { background: "linear-gradient(135deg, #06D6A0 0%, #05B386 100%)" }
              : {}
          }
        >
          {isAdding ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          min-width: 280px;
          flex-shrink: 0;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .product-image-wrapper {
          position: relative;
          width: 100%;
          height: 350px;
          overflow: hidden;
        }

        .badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 2;
        }

        .badge.sale {
          background: #ff4757;
          color: white;
        }

        .badge.new {
          background: #06d6a0;
          color: white;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .product-img {
          object-fit: cover;
          transition: opacity 0.3s ease;
        }

        .product-img.primary {
          opacity: 1;
        }

        .product-img.secondary {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
        }

        .product-card:hover .product-img.primary {
          opacity: 0;
        }

        .product-card:hover .product-img.secondary {
          opacity: 1;
        }

        .quick-actions {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .product-card:hover .quick-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .product-info {
          padding: 16px;
        }

        .product-name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-name:hover {
          color: #8b7355;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }

        .stars {
          color: #ffd700;
          font-size: 14px;
        }

        .rating-count {
          font-size: 12px;
          color: #999;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .current-price {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }

        .old-price {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }

        .discount {
          padding: 4px 8px;
          background: #fff3e0;
          color: #ff9500;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .size-section {
          margin-bottom: 12px;
        }

        .size-label {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 6px;
        }

        .size-dropdown {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          background: white;
        }

        .add-cart-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #8b7355 0%, #6d5a45 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-cart-btn:hover {
          transform: scale(1.02);
        }

        .add-cart-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 480px) {
          .product-image-wrapper {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (!products.length) return null;

  return (
    <section className="best-sellers">
      <div className="container">
        <div className="section-image-heading">
          <Image
            src="/Best Sellers.png"
            alt="Our Best Sellers"
            width={1920}
            height={200}
            className="full-width-heading"
          />
        </div>

        <div className="scroll-wrapper">
          {showLeftArrow && (
            <button className="scroll-btn left" onClick={() => scroll("left")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          <div
            className="products-container"
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>

          {showRightArrow && (
            <button className="scroll-btn right" onClick={() => scroll("right")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .best-sellers {
          padding: 20px 0 60px 0;
          background: #fafafa;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 32px;
          color: #8b7355;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .section-subtitle {
          font-size: 16px;
          color: #999;
          font-style: italic;
        }

        .scroll-wrapper {
          position: relative;
        }

        .scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: white;
          border: 2px solid #8b7355;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .scroll-btn:hover {
          background: #8b7355;
          color: white;
        }

        .scroll-btn svg {
          width: 24px;
          height: 24px;
        }

        .scroll-btn.left {
          left: -25px;
        }

        .scroll-btn.right {
          right: -25px;
        }

        .products-container {
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          cursor: grab;
        }

        .products-container::-webkit-scrollbar {
          display: none;
        }

        .products-container:active {
          cursor: grabbing;
        }

        .products-grid {
          display: flex;
          gap: 20px;
          padding: 10px 0;
        }

        @media (max-width: 768px) {
          .best-sellers {
            padding: 60px 16px;
          }

          .section-title {
            font-size: 28px;
          }

          .section-subtitle {
            font-size: 14px;
          }

          .scroll-btn {
            display: none;
          }

          .products-container {
            padding: 0 4px;
          }

          .products-grid {
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 24px;
          }

          .best-sellers {
            padding: 40px 12px;
          }
        }
      `}</style>
    </section>
  );
}
