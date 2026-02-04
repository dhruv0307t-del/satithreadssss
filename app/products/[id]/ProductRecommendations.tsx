"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    name: string;
    priceNew: number;
    priceOld?: number;
    mainImage: string;
    // Add other properties if needed
}

interface ProductRecommendationsProps {
    products: Product[];
}

export default function ProductRecommendations({ products }: ProductRecommendationsProps) {
    const { addToCart, openCart } = useCart();

    if (!products || products.length === 0) {
        return null;
    }

    const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
        e.preventDefault(); // Prevent navigation
        addToCart({
            id: product._id,
            title: product.name,
            price: product.priceNew,
            image: product.mainImage,
            qty: 1,
        });
        openCart();
    };

    return (
        <div className="product-container">
            <div className="recommendations-section" style={{ gridColumn: "1 / -1" }}>
                <div className="recommendations-header">
                    <h2 className="recommendations-title">You Might Also Like</h2>
                    <p className="recommendations-subtitle">Handpicked recommendations based on your style</p>
                </div>

                <div className="recommendations-grid">
                    {products.slice(0, 4).map((product) => (
                        <Link
                            key={product._id}
                            href={`/product/${product._id}`}
                            className="product-card"
                        >
                            <div className="product-image-container">
                                <Image
                                    src={product.mainImage || "/placeholder.jpg"}
                                    alt={product.name}
                                    fill
                                    className="product-image"
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                />
                            </div>
                            <div className="product-card-info">
                                <h3 className="product-card-title">{product.name}</h3>
                                <div className="product-card-price">
                                    <span>₹ {(product.priceNew || 0).toLocaleString()}</span>
                                    {product.priceOld &&
                                        <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through', fontWeight: 'normal' }}>
                                            ₹ {product.priceOld.toLocaleString()}
                                        </span>
                                    }
                                </div>
                                <button
                                    className="quick-add-btn"
                                    onClick={(e) => handleQuickAdd(e, product)}
                                >
                                    Quick Add
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
