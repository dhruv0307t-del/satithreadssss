"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ContactPage() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [notification, setNotification] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const router = useRouter();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({
                    type: "success",
                    message: data.message || "Thank you for reaching out! We'll get back to you soon.",
                });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
            } else {
                setNotification({
                    type: "error",
                    message: data.error || "Failed to send message. Please try again.",
                });
            }
        } catch (error) {
            setNotification({
                type: "error",
                message: "An error occurred. Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Navigation */}
            <nav className={`contact-nav ${isLoaded ? "nav-visible" : "nav-hidden"}`}>
                <div className="nav-left" onClick={() => router.push("/home")}>
                    <Image
                        src="/logo1.png"
                        alt="सतीDREAOS"
                        width={120}
                        height={40}
                        style={{ cursor: "pointer" }}
                    />
                </div>

                <ul className="contact-nav-links">
                    <li onClick={() => router.push("/home")}>Home</li>
                    <li onClick={() => router.push("/about")}>About</li>
                    <li onClick={() => router.push("/products")}>Shop</li>
                    <li onClick={() => router.push("/products")} className="search-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </li>
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="contact-hero">
                <h1>Let&apos;s Connect</h1>
                <p>We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
            </section>

            {/* Main Contact Section */}
            <section className="contact-main-section">
                <div className="contact-main-grid">
                    {/* Contact Info Side */}
                    <div className="contact-info-wrapper">
                        <div className="info-card">
                            <h2>Get in Touch</h2>
                            <p>Whether you have a question about our products, need support, or just want to share your story, we&apos;re here to listen.</p>

                            <div className="contact-methods">
                                <div className="contact-method">
                                    <div className="method-icon">📧</div>
                                    <div className="method-content">
                                        <h3>Email Us</h3>
                                        <p>support@satithreads.com</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">📱</div>
                                    <div className="method-content">
                                        <h3>Call Us</h3>
                                        <p>+91 93519 03011</p>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">📍</div>
                                    <div className="method-content">
                                        <h3>Visit Us</h3>
                                        <p>Jaipur, Rajasthan, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="illustration-wrapper">
                            <div className="illustration">💌</div>
                        </div>
                    </div>

                    {/* Contact Form Side */}
                    <div>
                        <div className="contact-form-card">
                            <div className="form-header">
                                <h2>Send us a Message</h2>
                                <p>Fill out the form below and we&apos;ll get back to you shortly</p>
                            </div>

                            {notification && (
                                <div className={`notification notification-${notification.type}`}>
                                    {notification.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form-main">
                                <div className="form-group">
                                    <label htmlFor="name">Your Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Your Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <div className="form-hint">Optional - We&apos;ll only call if absolutely necessary</div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        placeholder="What is this regarding?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Your Message <span className="required">*</span></label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us more about how we can help you..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                    />
                                </div>

                                <div className="submit-wrapper">
                                    <button type="submit" disabled={isSubmitting} className="btn-submit">
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="additional-info">
                            <div className="info-box">
                                <div className="info-box-icon">⚡</div>
                                <h3>Quick Response</h3>
                                <p>We typically respond within 24 hours on business days</p>
                            </div>

                            <div className="info-box">
                                <div className="info-box-icon">🤝</div>
                                <h3>Partnerships</h3>
                                <p>Interested in collaborating? Let&apos;s create something amazing together</p>
                            </div>

                            <div className="info-box">
                                <div className="info-box-icon">💬</div>
                                <h3>Support</h3>
                                <p>Need help with an order? Our team is here to assist you</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="contact-footer-main">
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
                .contact-nav {
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

                .contact-nav-links {
                    display: flex;
                    gap: 3rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .contact-nav-links li {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: var(--charcoal);
                    cursor: pointer;
                    position: relative;
                    transition: color 0.3s ease;
                    letter-spacing: 0.5px;
                }

                .contact-nav-links li::before {
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

                .contact-nav-links li:hover {
                    color: var(--terracotta);
                }

                .contact-nav-links li:hover::before {
                    width: 100%;
                }

                .contact-nav-links .search-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .contact-nav-links .search-link svg {
                    width: 20px;
                    height: 20px;
                }

                /* Hero Section */
                .contact-hero {
                    margin-top: 100px;
                    padding: 4rem 4rem 2rem;
                    text-align: center;
                    position: relative;
                }

                .contact-hero h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 4.5rem;
                    font-weight: 700;
                    color: var(--charcoal);
                    margin-bottom: 1.5rem;
                    animation: fadeInUp 0.8s ease-out 0.2s forwards;
                    opacity: 0;
                }

                .contact-hero p {
                    font-size: 1.3rem;
                    color: var(--charcoal);
                    opacity: 0.8;
                    max-width: 600px;
                    margin: 0 auto;
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

                /* Main Contact Section */
                .contact-main-section {
                    padding: 4rem 4rem 6rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .contact-main-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 5rem;
                    align-items: start;
                }

                /* Contact Info & Illustration */
                .contact-info-wrapper {
                    position: sticky;
                    top: 150px;
                }

                .info-card {
                    background: linear-gradient(135deg, var(--terracotta), var(--deep-rust));
                    padding: 3rem;
                    border-radius: 20px;
                    color: var(--warm-cream);
                    margin-bottom: 2rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(212, 105, 91, 0.3);
                }

                .info-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
                    border-radius: 50%;
                }

                .info-card h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    margin-bottom: 1.5rem;
                    position: relative;
                }

                .info-card > p {
                    font-size: 1.2rem;
                    line-height: 1.8;
                    margin-bottom: 2rem;
                    position: relative;
                }

                .contact-methods {
                    position: relative;
                }

                .contact-method {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }

                .contact-method:hover {
                    background: rgba(255,255,255,0.2);
                    transform: translateX(10px);
                }

                .method-icon {
                    width: 50px;
                    height: 50px;
                    background: var(--warm-cream);
                    color: var(--terracotta);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .method-content h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.3rem;
                    opacity: 0.9;
                }

                .method-content p {
                    font-size: 1rem;
                    margin: 0;
                    opacity: 0.8;
                }

                /* Decorative illustration */
                .illustration-wrapper {
                    margin-top: 2rem;
                    position: relative;
                    height: 250px;
                    background: linear-gradient(135deg, var(--sand), var(--warm-cream));
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .illustration-wrapper::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 105, 91, 0.05) 10px, rgba(212, 105, 91, 0.05) 20px);
                }

                .illustration {
                    position: relative;
                    font-size: 8rem;
                    animation: pulse 3s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }

                /* Contact Form */
                .contact-form-card {
                    background: white;
                    padding: 3rem;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
                    position: relative;
                }

                .contact-form-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background: linear-gradient(90deg, var(--terracotta), var(--gold), var(--sage));
                    border-radius: 20px 20px 0 0;
                }

                .form-header {
                    margin-bottom: 2rem;
                }

                .form-header h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    color: var(--charcoal);
                    margin-bottom: 0.5rem;
                }

                .form-header p {
                    font-size: 1.1rem;
                    color: var(--charcoal);
                    opacity: 0.7;
                    margin: 0;
                }

                .notification {
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                }

                .notification-success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .notification-error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                .form-group {
                    margin-bottom: 2rem;
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }

                .form-group:nth-child(1) { animation-delay: 0.1s; }
                .form-group:nth-child(2) { animation-delay: 0.2s; }
                .form-group:nth-child(3) { animation-delay: 0.3s; }
                .form-group:nth-child(4) { animation-delay: 0.4s; }
                .form-group:nth-child(5) { animation-delay: 0.5s; }

                .form-group label {
                    display: block;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--charcoal);
                    margin-bottom: 0.8rem;
                    letter-spacing: 0.3px;
                }

                .form-group label .required {
                    color: var(--terracotta);
                    margin-left: 3px;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 1rem 1.5rem;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.1rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    background: var(--warm-cream);
                    color: var(--charcoal);
                    transition: all 0.3s ease;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--terracotta);
                    background: white;
                    box-shadow: 0 5px 20px rgba(212, 105, 91, 0.1);
                    transform: translateY(-2px);
                }

                .form-group textarea {
                    resize: vertical;
                    min-height: 150px;
                }

                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: var(--charcoal);
                    opacity: 0.4;
                }

                .form-hint {
                    font-size: 0.9rem;
                    color: var(--charcoal);
                    opacity: 0.6;
                    margin-top: 0.5rem;
                }

                .submit-wrapper {
                    display: flex;
                    gap: 1.5rem;
                    margin-top: 3rem;
                }

                .btn-submit {
                    flex: 1;
                    padding: 1.3rem 3rem;
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: var(--warm-cream);
                    background: linear-gradient(135deg, var(--terracotta), var(--deep-rust));
                    border: none;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.4s ease;
                    letter-spacing: 1px;
                    box-shadow: 0 10px 30px rgba(212, 105, 91, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .btn-submit::before {
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

                .btn-submit:hover::before {
                    width: 400px;
                    height: 400px;
                }

                .btn-submit:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(212, 105, 91, 0.4);
                }

                .btn-submit:active {
                    transform: translateY(-1px);
                }

                .btn-submit:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Info Cards Below Form */
                .additional-info {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    margin-top: 4rem;
                }

                .info-box {
                    background: white;
                    padding: 2rem;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    border-top: 3px solid var(--terracotta);
                }

                .info-box:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                }

                .info-box-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .info-box h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    color: var(--charcoal);
                    margin-bottom: 0.8rem;
                }

                .info-box p {
                    font-size: 1rem;
                    color: var(--charcoal);
                    opacity: 0.7;
                    line-height: 1.6;
                    margin: 0;
                }

                /* Footer */
                .contact-footer-main {
                    background: var(--charcoal);
                    color: var(--sand);
                    padding: 3rem 4rem;
                    text-align: center;
                    margin-top: 4rem;
                }

                .contact-footer-main p {
                    font-size: 1rem;
                    opacity: 0.8;
                    margin: 0;
                }

                @media (max-width: 1024px) {
                    .contact-main-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }

                    .contact-info-wrapper {
                        position: static;
                    }

                    .additional-info {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .contact-nav {
                        padding: 1rem 1.5rem;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }

                    .nav-left {
                        flex-shrink: 0;
                    }

                    .contact-nav-links {
                        gap: 1.2rem;
                        flex-wrap: wrap;
                        justify-content: center;
                        width: 100%;
                        order: 3;
                    }

                    .contact-nav-links li {
                        font-size: 0.95rem;
                    }

                    .contact-hero {
                        margin-top: 140px;
                        padding: 2rem 1.5rem;
                    }

                    .contact-hero h1 {
                        font-size: 2.5rem;
                        line-height: 1.2;
                    }

                    .contact-hero p {
                        font-size: 1.1rem;
                    }

                    .contact-main-section {
                        padding: 2rem 1.5rem 3rem;
                    }

                    .contact-main-grid {
                        gap: 2rem;
                    }

                    .info-card {
                        padding: 2rem;
                    }

                    .info-card h2 {
                        font-size: 2rem;
                    }

                    .info-card > p {
                        font-size: 1.1rem;
                    }

                    .contact-method {
                        gap: 1rem;
                        padding: 0.8rem;
                    }

                    .method-icon {
                        width: 45px;
                        height: 45px;
                        font-size: 1.3rem;
                    }

                    .method-content h3 {
                        font-size: 1rem;
                    }

                    .method-content p {
                        font-size: 0.95rem;
                    }

                    .illustration-wrapper {
                        height: 200px;
                    }

                    .illustration {
                        font-size: 6rem;
                    }

                    .contact-form-card {
                        padding: 2rem 1.5rem;
                    }

                    .form-header h2 {
                        font-size: 1.75rem;
                    }

                    .form-header p {
                        font-size: 1rem;
                    }

                    .form-group {
                        margin-bottom: 1.5rem;
                    }

                    .form-group label {
                        font-size: 1rem;
                    }

                    .form-group input,
                    .form-group textarea {
                        padding: 0.9rem 1.2rem;
                        font-size: 1rem;
                    }

                    .submit-wrapper {
                        flex-direction: column;
                        margin-top: 2rem;
                    }

                    .btn-submit {
                        width: 100%;
                        padding: 1.2rem 2.5rem;
                        font-size: 1.1rem;
                    }

                    .additional-info {
                        margin-top: 3rem;
                        gap: 1.5rem;
                    }

                    .info-box {
                        padding: 1.5rem;
                    }

                    .info-box-icon {
                        font-size: 2rem;
                    }

                    .info-box h3 {
                        font-size: 1.2rem;
                    }

                    .info-box p {
                        font-size: 0.95rem;
                    }

                    .contact-footer-main {
                        padding: 2rem 1.5rem;
                    }

                    .contact-footer-main p {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 640px) {
                    .contact-nav {
                        padding: 0.8rem 1rem;
                    }

                    .nav-left img {
                        width: 100px !important;
                        height: 33px !important;
                    }

                    .contact-nav-links {
                        gap: 1rem;
                    }

                    .contact-nav-links li {
                        font-size: 0.85rem;
                    }

                    .contact-hero {
                        margin-top: 130px;
                        padding: 2rem 1rem;
                    }

                    .contact-hero h1 {
                        font-size: 2rem;
                        line-height: 1.2;
                    }

                    .contact-hero p {
                        font-size: 1rem;
                        max-width: 100%;
                    }

                    .contact-main-section {
                        padding: 2rem 1rem 3rem;
                    }

                    .info-card {
                        padding: 1.5rem;
                    }

                    .info-card h2 {
                        font-size: 1.75rem;
                    }

                    .info-card > p {
                        font-size: 1rem;
                    }

                    .contact-method {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.8rem;
                    }

                    .method-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 1.2rem;
                    }

                    .illustration-wrapper {
                        height: 150px;
                    }

                    .illustration {
                        font-size: 4rem;
                    }

                    .contact-form-card {
                        padding: 1.5rem 1rem;
                    }

                    .form-header h2 {
                        font-size: 1.5rem;
                    }

                    .form-header p {
                        font-size: 0.95rem;
                    }

                    .form-group input,
                    .form-group textarea {
                        padding: 0.8rem 1rem;
                        font-size: 0.95rem;
                    }

                    .form-group textarea {
                        min-height: 120px;
                    }

                    .btn-submit {
                        padding: 1rem 2rem;
                        font-size: 1rem;
                    }

                    .info-box {
                        padding: 1.2rem;
                    }

                    .contact-footer-main {
                        padding: 1.5rem 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .contact-hero h1 {
                        font-size: 1.75rem;
                    }

                    .contact-hero p {
                        font-size: 0.95rem;
                    }

                    .contact-nav-links li {
                        font-size: 0.8rem;
                    }

                    .info-card h2 {
                        font-size: 1.5rem;
                    }

                    .form-header h2 {
                        font-size: 1.3rem;
                    }
                }
            `}</style>
        </>
    );
}
