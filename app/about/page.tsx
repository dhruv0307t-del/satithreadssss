"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            {/* Navigation */}
            <nav className={`about-nav ${isLoaded ? "nav-visible" : "nav-hidden"}`}>
                <div className="nav-left" onClick={() => router.push("/home")}>
                    <Image
                        src="/logo1.png"
                        alt="सतीDREAOS"
                        width={120}
                        height={40}
                        style={{ cursor: "pointer" }}
                    />
                </div>

                <ul className="about-nav-links">
                    <li onClick={() => router.push("/home")}>Home</li>
                    <li onClick={() => router.push("/products")}>Shop</li>
                    <li onClick={() => router.push("/contact")}>Contact</li>
                    <li onClick={() => router.push("/products")} className="search-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="about-hero">
                <div className="deco-circle deco-circle-1"></div>
                <div className="deco-circle deco-circle-2"></div>

                <div className="about-hero-content">
                    <div className="section-label">Our Journey</div>
                    <h1>From Dreams<br />to Reality</h1>
                </div>
            </section>

            {/* Story Section */}
            <section className="story-section">
                <div className="story-grid">
                    <div className="story-text">
                        <p>From a small district called Baran in Rajasthan, a young boy stepped into the city of Jaipur with nothing but determination and a dream.</p>

                        <p>Coming from a modest background, the journey was never easy. New city, new struggles, and countless challenges—but every obstacle was met with unwavering ambition.</p>

                        <p>While completing his college education, he dared to dream day and night—to one day build a brand of his own.</p>

                        <p>What started as an idea slowly turned into belief. Late nights, hard work, learning from failures, and trusting the process—every step shaped the vision. The dream was not just about business, but about creating something meaningful, something that reflects passion, creativity, and self-made success.</p>
                    </div>

                    <div className="story-visual">
                        <div className="journey-illustration">
                            <div className="journey-path">
                                <div className="journey-step">
                                    <div className="step-icon">🏛️</div>
                                    <div className="step-content">
                                        <h3>Baran to Jaipur</h3>
                                        <p>A humble beginning with limitless determination</p>
                                    </div>
                                </div>

                                <div className="journey-step">
                                    <div className="step-icon">📚</div>
                                    <div className="step-content">
                                        <h3>Student to Dreamer</h3>
                                        <p>College days fueled by ambition and vision</p>
                                    </div>
                                </div>

                                <div className="journey-step">
                                    <div className="step-icon">✨</div>
                                    <div className="step-content">
                                        <h3>Dream to Reality</h3>
                                        <p>A brand built on passion and perseverance</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="story-text-center">
                    <p><strong>Today, that dream stands real.</strong></p>
                    <p>This brand is a reflection of a journey—from Baran to Jaipur, from a student to a founder, from a dream to reality. It represents courage, consistency, and the belief that no matter where you come from, your dreams are always valid.</p>
                    <p>We don&apos;t just create products. We create stories, inspired by real journeys—just like this one.</p>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="values-content">
                    <h2>What We Stand For</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">💪</div>
                            <h3>Courage</h3>
                            <p>The bravery to dream beyond circumstances and pursue what seems impossible</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">🎯</div>
                            <h3>Consistency</h3>
                            <p>Showing up every day, trusting the process, and never giving up on the vision</p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">🌟</div>
                            <h3>Belief</h3>
                            <p>Unwavering faith that your dreams are valid, regardless of where you start</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta-section">
                <div className="about-cta-content">
                    <h2>Explore Our Journey</h2>
                    <div className="about-cta-buttons">
                        <button onClick={() => router.push("/products")} className="btn btn-primary">
                            Explore Our Products
                        </button>
                        <button onClick={() => router.push("/contact")} className="btn btn-secondary">
                            Get in Touch
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="about-footer">
                <p>&copy; 2026 सतीDREAOS. Crafted with passion from Rajasthan.</p>
            </footer>

            <style jsx>{`
                :root {
                    --terracotta: #D4695B;
                    --deep-rust: #8B4513;
                    --sand: #F4E8D8;
                    --warm-cream: #FFF8F0;
                    --charcoal: #2C2C2C;
                    --gold: #C9A961;
                    --sage: #8B9D83;
                }

                /* Navigation */
                .about-nav {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    padding: 1.5rem 4rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 248, 240, 0.95);
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                    border-bottom: 1px solid rgba(212, 105, 91, 0.1);
                    transition: transform 0.8s ease-out, opacity 0.8s ease-out;
                }

                .nav-hidden {
                    transform: translateY(-100%);
                    opacity: 0;
                }

                .nav-visible {
                    transform: translateY(0);
                    opacity: 1;
                }

                .about-nav-links {
                    display: flex;
                    gap: 3rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .about-nav-links li {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: var(--charcoal);
                    cursor: pointer;
                    position: relative;
                    transition: color 0.3s ease;
                    letter-spacing: 0.5px;
                }

                .about-nav-links li::before {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 50%;
                    width: 0;
                    height: 1px;
                    background: var(--terracotta);
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }

                .about-nav-links li:hover {
                    color: var(--terracotta);
                }

                .about-nav-links li:hover::before {
                    width: 100%;
                }

                .about-nav-links .search-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .about-nav-links .search-link svg {
                    width: 20px;
                    height: 20px;
                }

                /* Hero Section */
                .about-hero {
                    margin-top: 100px;
                    padding: 6rem 4rem;
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                }

                .deco-circle {
                    position: absolute;
                    border-radius: 50%;
                    opacity: 0.15;
                    animation: float 6s ease-in-out infinite;
                }

                .deco-circle-1 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, var(--terracotta), transparent);
                    top: 10%;
                    right: 10%;
                    animation-delay: 0s;
                }

                .deco-circle-2 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, var(--gold), transparent);
                    bottom: 20%;
                    left: 5%;
                    animation-delay: 2s;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-30px) scale(1.05);
                    }
                }

                .about-hero-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .section-label {
                    font-size: 0.9rem;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: var(--terracotta);
                    margin-bottom: 1.5rem;
                    animation: fadeInUp 0.8s ease-out 0.2s forwards;
                    opacity: 0;
                }

                .about-hero h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 5rem;
                   font-weight: 700;
                    color: var(--charcoal);
                    margin-bottom: 2rem;
                    line-height: 1.1;
                    animation: fadeInUp 0.8s ease-out 0.4s forwards;
                    opacity: 0;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Story Section */
                .story-section {
                    padding: 4rem 4rem 6rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .story-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    margin-bottom: 4rem;
                }

                .story-text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .story-text p {
                    font-size: 1.25rem;
                    line-height: 2;
                    color: var(--charcoal);
                    margin-bottom: 1.5rem;
                    animation: fadeIn 1s ease-out 0.6s forwards;
                    opacity: 0;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .story-visual {
                    position: relative;
                    min-height: 500px;
                }

                .journey-illustration {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, var(--sand) 0%, var(--warm-cream) 100%);
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 20px 60px rgba(212, 105, 91, 0.15);
                    overflow: hidden;
                }

                .journey-illustration::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(45deg, transparent 45%, var(--gold) 45%, var(--gold) 55%, transparent 55%),
                        linear-gradient(-45deg, transparent 45%, var(--gold) 45%, var(--gold) 55%, transparent 55%);
                    background-size: 60px 60px;
                    opacity: 0.03;
                }

                .journey-path {
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .journey-step {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    animation: slideInRight 0.8s ease-out forwards;
                    opacity: 0;
                }

                .journey-step:nth-child(1) {
                    animation-delay: 0.8s;
                }

                .journey-step:nth-child(2) {
                    animation-delay: 1.2s;
                    margin-left: 4rem;
                }

                .journey-step:nth-child(3) {
                    animation-delay: 1.6s;
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .step-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--warm-cream);
                    background: linear-gradient(135deg, var(--terracotta), var(--deep-rust));
                    box-shadow: 0 10px 30px rgba(212, 105, 91, 0.3);
                    flex-shrink: 0;
                }

                .step-content h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    color: var(--charcoal);
                    margin-bottom: 0.5rem;
                }

                .step-content p {
                    font-size: 1rem;
                    color: var(--charcoal);
                    opacity: 0.8;
                    line-height: 1.6;
                    margin: 0;
                }

                .story-text-center {
                    text-align: center;
                    max-width: 900px;
                    margin: 4rem auto 0;
                }

                .story-text-center p {
                    font-size: 1.25rem;
                    line-height: 2;
                    color: var(--charcoal);
                    margin-bottom: 1.5rem;
                }

                /* Values Section */
                .values-section {
                    background: linear-gradient(135deg, var(--terracotta) 0%, var(--deep-rust) 100%);
                    padding: 6rem 4rem;
                    position: relative;
                    overflow: hidden;
                }

                .values-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: rotate 60s linear infinite;
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .values-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .values-content h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3.5rem;
                    color: var(--warm-cream);
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .values-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 3rem;
                }

                .value-card {
                    background: rgba(255, 248, 240, 0.95);
                    padding: 3rem 2rem;
                    border-radius: 15px;
                    text-align: center;
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                    animation: fadeInScale 0.8s ease-out forwards;
                    opacity: 0;
                }

                .value-card:nth-child(1) {
                    animation-delay: 0.2s;
                }

                .value-card:nth-child(2) {
                    animation-delay: 0.4s;
                }

                .value-card:nth-child(3) {
                    animation-delay: 0.6s;
                }

                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .value-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                }

                .value-icon {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                }

                .value-card h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    color: var(--terracotta);
                    margin-bottom: 1rem;
                }

                .value-card p {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: var(--charcoal);
                }

                /* CTA Section */
                .about-cta-section {
                    padding: 6rem 4rem;
                    text-align: center;
                    background: var(--warm-cream);
                }

                .about-cta-content h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    color: var(--charcoal);
                    margin-bottom: 3rem;
                }

                .about-cta-buttons {
                    display: flex;
                    gap: 2rem;
                    justify-content: center;
                }

                .btn {
                    padding: 1.2rem 3rem;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.2rem;
                    font-weight: 600;
                    text-decoration: none;
                    border-radius: 50px;
                    transition: all 0.4s ease;
                    letter-spacing: 1px;
                    position: relative;
                    overflow: hidden;
                    border: none;
                    cursor: pointer;
                }

                .btn::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    transform: translate(-50%, -50%);
                    transition: width 0.6s ease, height 0.6s ease;
                }

                .btn:hover::before {
                    width: 400px;
                    height: 400px;
                }

                .btn-primary {
                    background: linear-gradient(135deg, var(--terracotta), var(--deep-rust));
                    color: var(--warm-cream);
                    box-shadow: 0 10px 30px rgba(212, 105, 91, 0.3);
                }

                .btn-primary:hover {
                    box-shadow: 0 15px 40px rgba(212, 105, 91, 0.4);
                    transform: translateY(-3px);
                }

                .btn-secondary {
                    background: transparent;
                    color: var(--terracotta);
                    border: 2px solid var(--terracotta);
                }

                .btn-secondary:hover {
                    background: var(--terracotta);
                    color: var(--warm-cream);
                    transform: translateY(-3px);
                }

                /* Footer */
                .about-footer {
                    background: var(--charcoal);
                    color: var(--sand);
                    padding: 3rem 4rem;
                    text-align: center;
                }

                .about-footer p {
                    font-size: 1rem;
                    opacity: 0.8;
                    margin: 0;
                }

                /* Responsive */
                @media (max-width: 968px) {
                    .about-nav {
                        padding: 1.5rem 2rem;
                    }

                    .about-nav-links {
                        gap: 1.5rem;
                    }

                    .about-hero h1 {
                        font-size: 3.5rem;
                    }

                    .story-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }

                    .journey-step:nth-child(2) {
                        margin-left: 0;
                    }

                    .values-grid {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .about-cta-buttons {
                        flex-direction: column;
                        align-items: center;
                        max-width: 400px;
                        margin: 0 auto;
                    }

                    .btn {
                        width: 100%;
                    }
                }

                @media (max-width: 640px) {
                    .about-hero {
                        padding: 3rem 1.5rem;
                    }

                    .about-hero h1 {
                        font-size: 2.5rem;
                    }

                    .values-content h2,
                    .about-cta-content h2 {
                        font-size: 2rem;
                    }

                    .story-section,
                    .about-cta-section {
                        padding: 3rem 1.5rem;
                    }

                    .story-text p,
                    .story-text-center p {
                        font-size: 1.1rem;
                    }

                    .journey-illustration {
                        padding: 2rem;
                    }

                    .step-icon {
                        width: 60px;
                        height: 60px;
                        font-size: 1.5rem;
                    }

                    .step-content h3 {
                        font-size: 1.2rem;
                    }

                    .step-content p {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </>
    );
}
