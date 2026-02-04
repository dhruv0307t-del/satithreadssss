"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuthModal } from "../context/AuthModalContext";
import { useCouponModal } from "../context/CouponModalContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserMenu from "../components/UserMenu";
import CouponPopup from "../components/CouponPopup";
import BestSellers from "./components/BestSellers";
import ContactFooter from "./components/ContactFotter";
import FooterBanner from "./components/FooterBanner";
import FestiveSection from "./components/FestiveSection";

// Icon Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { openCart } = useCart();
  const { openModal } = useAuthModal();
  const { openModal: openCouponModal } = useCouponModal();
  const { data: session } = useSession();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Categories data
  const categories = [
    { title: "Kurta Sets", slug: "kurta-sets", img: "/cat-kurta.png" },
    { title: "Dupatta Sets", slug: "dupatta-sets", img: "/Dupaata Set.jpg" },
    { title: "Skirts", slug: "skirts", img: "/Skirts.jpg" },
    { title: "Cord Sets", slug: "cord-sets", img: "/cat-coord.png" },
    { title: "Farshi Salwar Sets", slug: "farshi-salwar-sets", img: "/Farshi Salwar Suit.jpg" },
    { title: "Tops", slug: "tops", img: "/Gate (5).png" },
    { title: "Short Kurtis", slug: "short-kurtis", img: "/Short Kuti.jpg" },
  ];

  // Carousel settings - 4 cards visible at a time
  const cardsPerView = 4;
  const totalSlides = Math.ceil(categories.length / cardsPerView);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Navigate carousel
  // Scroll handlers
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 🧭 NAVBAR */}
      <nav className={`navbar ${isLoaded ? "nav-visible" : "nav-hidden"}`}>
        {/* LEFT */}
        <div className="nav-left">
          <Image src="/logo1.png" alt="Satithreads" width={120} height={40} />
        </div>

        {/* CENTER */}
        <ul className="nav-links">
          <li onClick={() => router.push("/products?category=new")}>New Arrivals</li>
          <li
            onClick={() =>
              document
                .getElementById("categories-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Categories
          </li>
          <li onClick={() => router.push("/products?category=festive")}>Festive</li>
          <li onClick={openCouponModal}>Offers</li>
          <li>About</li>
        </ul>

        {/* RIGHT */}
        <div className="nav-right">
          <div className="nav-icon"><SearchIcon /></div>
          <div className="nav-icon" onClick={openCart}><CartIcon /></div>

          {session ? (
            <UserMenu />
          ) : (
            <div
              onClick={() => openModal("/home")}
              className="nav-icon"
              style={{ cursor: "pointer" }}
            >
              <UserIcon />
            </div>
          )}
          <div className="nav-icon"><HelpIcon /></div>
          <div className="nav-icon"><PhoneIcon /></div>
        </div>
      </nav>

      {/* 🌄 HERO */}
      {isLoaded && (
        <section className="hero-banner">
          <Image src="/Banner.png" alt="Hero" fill priority className="hero-image" />

          <div className="hero-luxury-overlay">
            <div className="hero-copy">
              {/* Hero content */}
            </div>
          </div>
        </section>
      )}

      {/* ================= CATEGORIES CAROUSEL ================= */}
      {isLoaded && (
        <section id="categories-section" className="categories-section">
          <h2 className="categories-title">Shop by Category</h2>

          <div className="categories-carousel-container">
            <div className="categories-carousel-box">
              <div className="categories-carousel-wrapper">
                {/* Previous Button */}
                <button
                  className="carousel-nav-button prev"
                  onClick={scrollLeft}
                  aria-label="Previous"
                >
                  <ChevronLeftIcon />
                </button>

                {/* Cards Grid */}
                <div
                  className="categories-grid"
                  ref={carouselRef}
                >
                  {categories.map((cat) => (
                    <div
                      key={cat.slug}
                      className="category-card-new"
                      onClick={() => router.push(`/category/${cat.slug}`)}
                    >
                      <img src={cat.img} className="category-img-bg" alt={cat.title} />
                      <div className="category-overlay"></div>
                      <div className="category-label-vertical">{cat.title.toUpperCase()}</div>
                    </div>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  className="carousel-nav-button next"
                  onClick={scrollRight}
                  aria-label="Next"
                >
                  <ChevronRightIcon />
                </button>
              </div>

            </div>
          </div>

        </section >
      )
      }

      {/* ================= FESTIVE SECTION ================= */}
      {isLoaded && <FestiveSection />}

      {/* ================= BEST SELLERS ================= */}
      {
        isLoaded && (
          <section>
            <BestSellers />
          </section>
        )
      }

      {isLoaded && <ContactFooter />}
      {isLoaded && <FooterBanner />}

      {/* Coupon Popup */}
      <CouponPopup />
    </>
  );
}