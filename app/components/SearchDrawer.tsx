"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "../context/SearchContext";

export default function SearchDrawer() {
    const router = useRouter();
    const { isSearchOpen, closeSearch } = useSearch();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const suggestions = [
        { title: "gold georgette anarkali", query: "gold georgette" },
        { title: "pista green gher suit", query: "pista green" },
        { title: "ocean green gher suit", query: "ocean green" },
    ];

    // Auto-focus input when drawer opens
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 400);
        } else {
            setQuery("");
            setResults([]);
        }
    }, [isSearchOpen]);

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length > 2) {
                performSearch();
            } else {
                setResults([]);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
            const data = await res.json();
            setResults(data.products || []);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId: string) => {
        closeSearch();
        router.push(`/products/${productId}`);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`sd-overlay${isSearchOpen ? " sd-overlay--open" : ""}`}
                onClick={closeSearch}
            />

            {/* Drawer */}
            <div className={`sd-drawer${isSearchOpen ? " sd-drawer--open" : ""}`}>
                {/* Header */}
                <div className="sd-header">
                    <span className="sd-header-title">Search</span>
                    <button className="sd-close" onClick={closeSearch}>✕</button>
                </div>

                <div className="sd-content">
                    {/* Search Box */}
                    <div className="sd-search-box">
                        <div className="sd-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search our store..."
                                className="sd-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <span className="sd-search-icon">🔍</span>
                        </div>
                    </div>

                    {/* Suggestions */}
                    {!query && (
                        <div className="sd-section">
                            <h4 className="sd-section-title">Suggestions</h4>
                            <div className="sd-suggestions">
                                {suggestions.map((s, i) => (
                                    <div
                                        key={i}
                                        className="sd-suggestion-item"
                                        onClick={() => setQuery(s.query)}
                                    >
                                        {s.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {query.length > 0 && (
                        <div className="sd-section">
                            <div className="sd-section-header">
                                <h4 className="sd-section-title">Products ({results.length})</h4>
                                {loading && <span className="sd-loading-spinner" />}
                            </div>

                            {results.length > 0 ? (
                                <div className="sd-results">
                                    {results.map((p) => (
                                        <div
                                            key={p._id}
                                            className="sd-product-card"
                                            onClick={() => handleProductClick(p._id)}
                                        >
                                            <div className="sd-product-img">
                                                <Image
                                                    src={p.mainImage || p.image || "/placeholder.jpg"}
                                                    alt={p.name}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                            <div className="sd-product-info">
                                                <h5 className="sd-product-name">{p.name}</h5>
                                                <div className="sd-product-rating">
                                                    <span className="sd-stars">★★★★★</span>
                                                    <span className="sd-reviews">124 reviews</span>
                                                </div>
                                                <div className="sd-product-price">
                                                    {p.priceOld && <span className="sd-price-old">Rs. {p.priceOld}</span>}
                                                    <span className="sd-price-new">Rs. {p.priceNew || p.price}</span>
                                                </div>
                                                <button className="sd-quick-view">Quick view</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !loading && query.length > 2 && (
                                    <div className="sd-no-results">No products found for "{query}"</div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .sd-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 1500;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .sd-overlay--open {
          opacity: 1;
          visibility: visible;
        }

        .sd-drawer {
          position: fixed;
          top: 0;
          right: 0;
          width: 480px;
          height: 100vh;
          background: white;
          z-index: 1501;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
        }
        .sd-drawer--open {
          transform: translateX(0);
        }

        .sd-header {
          padding: 24px 28px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sd-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 600;
          color: #3b1f23;
        }
        .sd-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #3b1f23;
          padding: 4px;
        }

        .sd-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
        }
        .sd-content::-webkit-scrollbar { width: 4px; }
        .sd-content::-webkit-scrollbar-thumb { background: #E5DDD3; border-radius: 4px; }

        .sd-search-box {
          margin-bottom: 32px;
        }
        .sd-input-wrapper {
          position: relative;
          width: 100%;
        }
        .sd-input {
          width: 100%;
          padding: 14px 44px 14px 16px;
          border: 2px solid #3b1f23;
          border-radius: 4px;
          font-size: 16px;
          outline: none;
          font-family: inherit;
        }
        .sd-search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #3b1f23;
        }

        .sd-section {
          margin-bottom: 32px;
        }
        .sd-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .sd-section-title {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #3b1f23;
          border-bottom: 2px solid #3b1f23;
          padding-bottom: 4px;
          display: inline-block;
        }

        .sd-suggestions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sd-suggestion-item {
          font-size: 16px;
          color: #666;
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px 0;
          border-bottom: 1px dotted #ccc;
        }
        .sd-suggestion-item:hover {
          color: #3b1f23;
        }

        .sd-results {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sd-product-card {
          display: flex;
          gap: 16px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .sd-product-card:hover {
          transform: translateY(-2px);
        }
        .sd-product-img {
          position: relative;
          width: 100px;
          height: 125px;
          border-radius: 4px;
          overflow: hidden;
          background: #f9f9f9;
          flex-shrink: 0;
        }
        .sd-product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sd-product-name {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin: 0;
          line-height: 1.4;
        }
        .sd-product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }
        .sd-stars { color: #000; }
        .sd-reviews { color: #666; }
        .sd-product-price {
          display: flex;
          gap: 8px;
          align-items: center;
          margin: 4px 0;
        }
        .sd-price-old {
          text-decoration: line-through;
          color: #999;
          font-size: 13px;
        }
        .sd-price-new {
          font-weight: 700;
          color: #333;
          font-size: 16px;
        }
        .sd-quick-view {
          margin-top: auto;
          padding: 8px 16px;
          border: 1px solid #333;
          background: white;
          color: #333;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          width: fit-content;
        }
        .sd-quick-view:hover {
          background: #333;
          color: white;
        }

        .sd-loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #E5DDD3;
          border-top: 2px solid #3b1f23;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .sd-no-results {
          padding: 20px 0;
          color: #999;
          font-style: italic;
        }

        @media (max-width: 500px) {
          .sd-drawer {
            width: 100%;
          }
          .sd-product-img {
            width: 80px;
            height: 100px;
          }
        }
      `}</style>
        </>
    );
}
