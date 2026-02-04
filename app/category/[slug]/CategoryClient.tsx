"use client";
import { toggleWishlist, toggleLiked } from "@/app/actions/user";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import "../../category-products.css";

interface Product {
  _id: string;
  name: string;
  priceNew: number;
  priceOld?: number;
  mainImage: string;
  gridImages?: string[];
  sizes?: string[];
  quantity: number;
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

  const isSoldOut = product.quantity === 0;

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
    <div className="cp-product-card group">
      {/* IMAGE CONTAINER */}
      <div
        className="cp-product-image-container"
        onClick={() => router.push(`/product/${product._id}`)}
      >
        {isSoldOut ? (
          <span className="cp-product-badge sold-out">Sold Out</span>
        ) : discount > 0 ? (
          <span className="cp-product-badge sale">Sale</span>
        ) : null}

        <Image
          src={product.mainImage || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="cp-product-image primary"
        />
        <Image
          src={secondaryImage || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="cp-product-image secondary"
        />

        <div className="cp-quick-actions">
          <button
            className="cp-quick-action-btn"
            title="Quick View"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product._id}`);
            }}
          >
            👁️
          </button>
          <button
            className="cp-quick-action-btn"
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
            className="cp-quick-action-btn"
            title="Add to Liked"
            onClick={async (e) => {
              e.stopPropagation();
              await toggleLiked(product._id);
              router.push("/my-orders?tab=liked");
            }}
          >
            ⚖️
          </button>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="cp-product-info">
        <h3
          className="cp-product-title"
          onClick={() => router.push(`/product/${product._id}`)}
        >
          {product.name}
        </h3>

        <div className="cp-product-rating">
          <div className="cp-stars">★★★★★</div>
          <span className="cp-rating-count">(22)</span>
        </div>

        <div className="cp-product-price">
          <span className="cp-current-price">Rs. {product.priceNew}</span>
          {product.priceOld && (
            <>
              <span className="cp-original-price">Rs. {product.priceOld}</span>
              {discount > 0 && <span className="cp-discount-badge">{discount}% OFF</span>}
            </>
          )}
        </div>

        <div className="cp-size-selector">
          <div className="cp-size-label">Select Size</div>
          <select
            className="cp-size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            disabled={isSoldOut}
          >
            {isSoldOut ? (
              <option>Sold out</option>
            ) : (
              <>
                <option value="">Select Size</option>
                {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <button
          className="cp-add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={isSoldOut}
          style={isAdding ? { background: 'linear-gradient(135deg, #06D6A0 0%, #05B386 100%)' } : {}}
        >
          {isSoldOut ? "Sold out" : isAdding ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function CategoryClient({
  products,
  topImage,
}: any) {
  return (
    <div className="bg-[#FFF7EC] min-h-screen">
      {/* TOP IMAGE */}
      <img
        src={topImage}
        className="w-full max-h-[300px] object-cover"
        alt="Category Header"
      />

      {/* PRODUCTS SECTION */}
      <section className="category-products-section">
        <div className="cp-container">
          <div className="cp-products-grid">
            {products.length > 0 ? (
              products.map((p: Product) => (
                <ProductCard key={p._id} product={p} />
              ))
            ) : (
              <div className="col-span-4 text-center py-20">
                <p className="text-xl text-gray-500">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
