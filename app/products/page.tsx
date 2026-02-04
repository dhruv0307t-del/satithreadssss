"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useEffect, useState, Suspense, useMemo } from "react";
import Image from "next/image";

function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const isFestive = category === "festive";

  const { addToCart, openCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    // Fetch with isFestive=true if in festive mode, else just all products
    const url = isFestive ? "/api/products?isFestive=true&limit=50" : "/api/products?limit=50";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // The API returns { products, totalPages, currentPage }
        const productArray = Array.isArray(data.products) ? data.products : [];
        setProducts(productArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
        setLoading(false);
      });
  }, [isFestive]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EC]">
        <div className="text-2xl font-serif text-[#3d2415] animate-pulse">Loading Celebration...</div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF7EC]">
        <div className="text-6xl mb-4">🪔</div>
        <h2 className="text-2xl font-serif text-[#3d2415] mb-2">No Festive Products Found</h2>
        <p className="text-gray-500 mb-8">Our festive collection is being prepared. Check back soon!</p>
        <button
          onClick={() => router.push('/products')}
          className="px-8 py-3 bg-[#E63946] text-white rounded-full font-bold hover:shadow-lg transition-all"
        >
          View All Products
        </button>
      </div>
    );
  }

  if (isFestive) {
    return (
      <div className="min-h-screen bg-[#FFF7EC] relative overflow-x-hidden pt-20">
        {/* Decorative Elements */}
        <div className="diya-decoration diya-left">🪔</div>
        <div className="diya-decoration diya-right">🪔</div>
        <div className="diya-decoration diya-bottom-left">🪔</div>
        <div className="diya-decoration diya-bottom-right">🪔</div>

        <div className="rangoli-pattern rangoli-top"></div>
        <div className="rangoli-pattern rangoli-bottom"></div>

        {/* Festive Header */}
        <section className="festive-header">
          <div className="festive-badge">Limited Edition</div>
          <h1 className="festive-title">Festive Collection</h1>
          <p className="festive-subtitle">Celebrate in Style</p>
          <p className="festive-tagline">✨ Where Tradition Meets Fashion ✨</p>
          <div className="decorative-border"></div>

          {/* Sparkles and Fireworks */}
          {[...Array(6)].map((_, i) => (
            <div key={`sparkle-${i}`} className="sparkle" style={{
              top: `${15 + i * 10}%`,
              left: i % 2 === 0 ? '10%' : 'auto',
              right: i % 2 !== 0 ? '12%' : 'auto',
              animationDelay: `${i * 0.5}s`
            }}>
              {['✨', '⭐', '💫'][i % 3]}
            </div>
          ))}

          <div className="firework" style={{ top: '20%', left: '20%', animationDelay: '0s' }}>🎆</div>
          <div className="firework" style={{ top: '30%', right: '22%', animationDelay: '1s' }}>🎇</div>
          <div className="firework" style={{ top: '50%', left: '18%', animationDelay: '2s' }}>🎆</div>
          <div className="firework" style={{ top: '60%', right: '20%', animationDelay: '1.5s' }}>🎇</div>
        </section>

        {/* Products Section */}
        <section className="products-section festive-mode">
          <div className="festive-container">
            <div className="section-header text-center mb-12">
              <h2 className="section-title">✨ Festive Favorites ✨</h2>
              <p className="section-description">Curated collection for the celebration season</p>
            </div>

            <div className="festive-grid">
              {products.map((p, index) => (
                <div key={p._id} className="product-card festive-style">
                  <div className="product-image-container group cursor-pointer" onClick={() => router.push(`/products/${p._id}`)}>
                    <span className="product-badge">Festive Special</span>

                    {/* Fixed Alt for Accessibility */}
                    <img
                      src={p.mainImage || p.image}
                      alt={p.name || `Festive Product ${index}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Quick Actions */}
                    <div className="quick-actions opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                      <button className="quick-action-btn" onClick={(e) => { e.stopPropagation(); router.push(`/products/${p._id}`); }}>👁️</button>
                      <button className="quick-action-btn">❤️</button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="product-title font-serif text-xl font-semibold text-[#3d2415] mb-2 cursor-pointer hover:text-[#E63946]" onClick={() => router.push(`/products/${p._id}`)}>
                      {p.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-[#FFD700] text-sm">★★★★★</div>
                      <span className="text-xs text-gray-400">(22)</span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#E63946] to-[#FFD700] bg-clip-text text-transparent">
                        Rs. {p.priceNew || p.price}
                      </span>
                      {(p.priceOld || p.oldPrice) && (
                        <span className="text-gray-400 line-through text-sm">Rs. {p.priceOld || p.oldPrice}</span>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Select Size</div>
                      <select className="w-full p-2 border-2 border-[#E5DDD3] rounded-lg text-sm bg-white" onClick={(e) => e.stopPropagation()}>
                        {p.sizes && p.sizes.length > 0 ? (
                          p.sizes.map((s: any) => (
                            <option key={s.size} value={s.size}>{s.size} - {s.stock > 0 ? 'In Stock' : 'Out of Stock'}</option>
                          ))
                        ) : (
                          <option>Standard Size</option>
                        )}
                      </select>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: p._id,
                          title: p.name,
                          price: p.priceNew || p.price,
                          image: p.mainImage || p.image,
                          qty: 1,
                        });
                        openCart();
                      }}
                      className="add-to-cart-btn w-full py-3 bg-gradient-to-r from-[#E63946] to-[#FF8C42] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-lg transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Festive Offers Banner */}
        <div className="festive-container pb-20">
          <div className="festive-offers">
            <h2 className="offers-title">🎁 Festive Special Benefits 🎁</h2>
            <div className="offers-grid">
              <div className="offer-card">
                <div className="offer-icon">🚚</div>
                <div className="offer-title-text text-xl font-bold text-[#E63946] mb-2">Free Shipping</div>
                <div className="text-sm text-[#5a3825]">On all festive orders above ₹999. Celebrate without delivery charges!</div>
              </div>
              <div className="offer-card">
                <div className="offer-icon">🎊</div>
                <div className="offer-title-text text-xl font-bold text-[#E63946] mb-2">Festive Collection</div>
                <div className="text-sm text-[#5a3825]">Exclusive festive designs curated just for you. Limited edition pieces!</div>
              </div>
              <div className="offer-card">
                <div className="offer-icon">🎁</div>
                <div className="offer-title-text text-xl font-bold text-[#E63946] mb-2">Gift Wrapping</div>
                <div className="text-sm text-[#5a3825]">Complimentary festive gift wrapping on all orders this season!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default View
  return (
    <div className="min-h-screen pt-32 px-8 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl font-serif text-center mb-12 tracking-wide uppercase">All Collections</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="group cursor-pointer"
              onClick={() => router.push(`/products/${p._id}`)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src={p.mainImage || p.image}
                  alt={p.name || "Product"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors">{p.name}</h3>
                <div className="flex gap-3 items-baseline">
                  <span className="font-bold text-lg">Rs. {p.priceNew || p.price}</span>
                  {(p.priceOld || p.oldPrice) && (
                    <span className="text-gray-400 line-through text-sm">Rs. {p.priceOld || p.oldPrice}</span>
                  )}
                </div>
              </div>

              <button
                className="w-full mt-4 py-3 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart({
                    id: p._id,
                    title: p.name,
                    price: p.priceNew || p.price,
                    image: p.mainImage || p.image,
                    qty: 1,
                  });
                  openCart();
                }}
              >
                Quick Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductList />
    </Suspense>
  );
}