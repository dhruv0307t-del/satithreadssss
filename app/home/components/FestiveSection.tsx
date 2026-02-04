"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FestiveSection() {
    const router = useRouter();
    const sparkleContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add more dynamic sparkles on scroll/interval
        const sparkleContainer = sparkleContainerRef.current;
        if (!sparkleContainer) return;

        let sparkleCount = 10;
        const maxSparkles = 20;

        const createSparkle = () => {
            if (!sparkleContainer) return;
            const sparkle = document.createElement("div");
            sparkle.className = "sparkle";
            sparkle.style.left = Math.random() * 100 + "%";
            sparkle.style.bottom = "0";
            sparkle.style.animationDelay = Math.random() * 3 + "s";
            sparkleContainer.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
                sparkleCount--;
            }, 3000);
        };

        const intervalId = setInterval(() => {
            if (sparkleCount < maxSparkles) {
                createSparkle();
                sparkleCount++;
            }
        }, 500);

        // Particle effect on mouse move
        const handleMouseMove = (e: MouseEvent) => {
            if (Math.random() > 0.95) {
                const particle = document.createElement("div");
                particle.style.position = "fixed";
                particle.style.left = e.clientX + "px";
                particle.style.top = e.clientY + "px";
                particle.style.width = "4px";
                particle.style.height = "4px";
                particle.style.background = "#ffd700";
                particle.style.borderRadius = "50%";
                particle.style.pointerEvents = "none";
                particle.style.zIndex = "9999";
                particle.style.boxShadow = "0 0 10px #ffd700";
                document.body.appendChild(particle);

                requestAnimationFrame(() => {
                    particle.style.transition = "all 1s ease-out";
                    particle.style.transform = "translateY(-50px) scale(0)";
                    particle.style.opacity = "0";
                });

                setTimeout(() => {
                    particle.remove();
                }, 1000);
            }
        };

        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <section className="festive-section">
            {/* Animated Background Pattern */}
            <div className="festive-background"></div>

            {/* Floating Rangoli Decorations */}
            <div className="rangoli-decoration"></div>
            <div className="rangoli-decoration"></div>
            <div className="rangoli-decoration"></div>

            {/* Sparkle Effects */}
            <div className="sparkle-container" ref={sparkleContainerRef}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="sparkle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Diya Border Lights */}
            <div className="diya-border">
                {/* Top Diyas */}
                {[...Array(6)].map((_, i) => (
                    <div key={`top-${i}`} className="diya-light top"></div>
                ))}

                {/* Bottom Diyas */}
                {[...Array(6)].map((_, i) => (
                    <div key={`bottom-${i}`} className="diya-light bottom"></div>
                ))}
            </div>

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <div key={`particle-${i}`} className="particle"></div>
            ))}

            {/* Main Content */}
            <div className="festive-content">
                <div className="festive-banner-wrapper">
                    {/* Corner Decorations */}
                    <div className="corner-decoration top-left"></div>
                    <div className="corner-decoration top-right"></div>
                    <div className="corner-decoration bottom-left"></div>
                    <div className="corner-decoration bottom-right"></div>

                    {/* Corner Mandalas */}
                    <svg className="corner-mandala top-left" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="none"
                            stroke="#ff9500"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle cx="50" cy="50" r="10" fill="#ff9500" opacity="0.6" />
                    </svg>

                    <svg className="corner-mandala top-right" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="none"
                            stroke="#ff9500"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle cx="50" cy="50" r="10" fill="#ff9500" opacity="0.6" />
                    </svg>

                    <svg className="corner-mandala bottom-left" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="none"
                            stroke="#ff9500"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle cx="50" cy="50" r="10" fill="#ff9500" opacity="0.6" />
                    </svg>

                    <svg className="corner-mandala bottom-right" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="none"
                            stroke="#ff9500"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            stroke="#ffd966"
                            strokeWidth="2"
                            opacity="0.6"
                        />
                        <circle cx="50" cy="50" r="10" fill="#ff9500" opacity="0.6" />
                    </svg>

                    {/* Banner Image */}
                    <div className="festive-banner-image-container">
                        <Image
                            src="/Sati Threads Festiv Banner.jpg"
                            alt="Festive Collection Banner"
                            width={1400}
                            height={600}
                            className="festive-banner-image"
                            priority
                        />
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => router.push("/products?category=festive")}
                        className="festive-cta"
                    >
                        Shop Festive Collection
                    </button>
                </div>
            </div>
        </section>
    );
}