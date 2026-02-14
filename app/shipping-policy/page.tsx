"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShippingPolicyPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("shipping");

    useEffect(() => {
        // Smooth scrolling for anchor links
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', function (e: Event) {
                e.preventDefault();
                const target = document.querySelector((e.target as HTMLAnchorElement).getAttribute('href') || '');
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active section highlighting
        const handleScroll = () => {
            const sections = document.querySelectorAll('.section');
            let current = 'shipping';

            sections.forEach(section => {
                const sectionTop = (section as HTMLElement).offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id') || 'shipping';
                }
            });

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className="policy-nav">
                <div className="logo" onClick={() => router.push("/home")}>
                    <Image src="/logo1.png" alt="Sati Threads" width={120} height={40} style={{ cursor: "pointer" }} />
                </div>
                <ul className="nav-links">
                    <li onClick={() => router.push("/home")}>Home</li>
                    <li onClick={() => router.push("/products")}>Shop</li>
                    <li onClick={() => router.push("/about")}>About</li>
                    <li onClick={() => router.push("/contact")}>Contact</li>
                </ul>
            </nav>

            <section className="hero">
                <div className="hero-content">
                    <div className="policy-badge">Delivery Information</div>
                    <h1>Shipping, Delivery & Exchange Policy</h1>
                    <p>Everything you need to know about ordering, receiving, and exchanging products from Sati Threads.</p>
                    <div className="last-updated">Last Updated: February 10, 2026</div>
                </div>
            </section>

            <div className="content-wrapper">
                <aside className="sidebar">
                    <nav className="toc">
                        <h3>Contents</h3>
                        <ul className="toc-list">
                            <li><a href="#shipping" className={activeSection === 'shipping' ? 'active' : ''}>Shipping & Delivery</a></li>
                            <li><a href="#charges" className={activeSection === 'charges' ? 'active' : ''}>Shipping Charges</a></li>
                            <li><a href="#exchange" className={activeSection === 'exchange' ? 'active' : ''}>Exchange Policy</a></li>
                            <li><a href="#eligibility" className={activeSection === 'eligibility' ? 'active' : ''}>Exchange Eligibility</a></li>
                            <li><a href="#non-exchangeable" className={activeSection === 'non-exchangeable' ? 'active' : ''}>Non-Exchangeable Items</a></li>
                            <li><a href="#process" className={activeSection === 'process' ? 'active' : ''}>Exchange Process</a></li>
                            <li><a href="#refund" className={activeSection === 'refund' ? 'active' : ''}>No Refund Policy</a></li>
                            <li><a href="#important" className={activeSection === 'important' ? 'active' : ''}>Important Notes</a></li>
                        </ul>
                    </nav>
                </aside>

                <main className="main-content">
                    <section id="shipping" className="section">
                        <h2><span className="section-icon">📦</span> Shipping & Delivery</h2>

                        <div className="icon-grid">
                            <div className="icon-item">
                                <div className="icon-item-emoji">⚡</div>
                                <div className="icon-item-content">
                                    <h4>Quick Processing</h4>
                                    <p>Orders processed within 1–2 business days</p>
                                </div>
                            </div>

                            <div className="icon-item">
                                <div className="icon-item-emoji">🚚</div>
                                <div className="icon-item-content">
                                    <h4>Fast Delivery</h4>
                                    <p>Delivered within 7 business days from dispatch</p>
                                </div>
                            </div>

                            <div className="icon-item">
                                <div className="icon-item-emoji">📍</div>
                                <div className="icon-item-content">
                                    <h4>Real-time Tracking</h4>
                                    <p>Track your order every step of the way</p>
                                </div>
                            </div>

                            <div className="icon-item">
                                <div className="icon-item-emoji">🌍</div>
                                <div className="icon-item-content">
                                    <h4>Nationwide Shipping</h4>
                                    <p>We deliver across India</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-box warning">
                            <p><strong>Please Note:</strong> Delivery timelines may vary due to location, weather conditions, or unforeseen courier delays. You will receive tracking details once your order has been shipped.</p>
                        </div>
                    </section>

                    <section id="charges" className="section">
                        <h2><span className="section-icon">💸</span> Shipping Charges</h2>
                        <p>Shipping charges (if applicable) will be clearly mentioned at checkout before you complete your purchase.</p>
                        <p>We regularly run promotional offers with free shipping. Keep an eye on our website for current deals and special offers!</p>

                        <div className="info-box">
                            <p><strong>Tip:</strong> Subscribe to our newsletter to receive notifications about free shipping promotions and exclusive offers.</p>
                        </div>
                    </section>

                    <section id="exchange" className="section">
                        <h2><span className="section-icon">🔁</span> Exchange Policy</h2>
                        <p>At Sati Threads, we follow a <strong>No Refund Policy</strong>. However, we do offer exchanges under specific conditions to ensure customer satisfaction.</p>

                        <div className="info-box important">
                            <p><strong>Important:</strong> We do not provide monetary refunds. Only product or size exchanges are available as per the conditions outlined below.</p>
                        </div>
                    </section>

                    <section id="eligibility" className="section">
                        <h2><span className="section-icon">✅</span> Exchange Eligibility</h2>
                        <p>To be eligible for an exchange, your product must meet all of the following conditions:</p>
                        <ul>
                            <li>Exchange request must be raised within <strong>7 days of delivery</strong></li>
                            <li>Product must be <strong>unused and unwashed</strong></li>
                            <li>Product must be in <strong>original condition</strong> with no signs of wear</li>
                            <li><strong>Original packaging and tags</strong> must be intact</li>
                            <li>You must provide your <strong>order ID</strong> and proof of purchase</li>
                        </ul>

                        <div className="info-box">
                            <p><strong>Pro Tip:</strong> Keep all packaging materials and tags until you&apos;re completely satisfied with your purchase to ensure smooth exchanges if needed.</p>
                        </div>
                    </section>

                    <section id="non-exchangeable" className="section">
                        <h2><span className="section-icon">❌</span> Non-Exchangeable Items</h2>
                        <p>The following items cannot be exchanged:</p>
                        <ul>
                            <li>Products damaged due to misuse, mishandling, or improper care</li>
                            <li>Items that have been washed, worn, or altered in any way</li>
                            <li>Products with missing tags or packaging</li>
                            <li>Items purchased during clearance or sale (unless stated otherwise in the sale terms)</li>
                            <li>Customized or personalized products</li>
                        </ul>

                        <div className="info-box warning">
                            <p><strong>Please Note:</strong> Final sale items and clearance products are typically not eligible for exchange unless explicitly mentioned during the sale.</p>
                        </div>
                    </section>

                    <section id="process" className="section">
                        <h2><span className="section-icon">📋</span> Exchange Process</h2>
                        <p>Follow these simple steps to initiate an exchange:</p>

                        <div className="process-steps">
                            <div className="step">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <p><strong>Contact Us:</strong> Email us at <a href="mailto:support@satithreads.com" style={{ color: 'var(--sage)' }}>support@satithreads.com</a> with your Order ID, reason for exchange, and clear product images (if required)</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <p><strong>Approval & Instructions:</strong> Once approved, our team will share detailed exchange instructions including return shipping address and process</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <p><strong>Quality Inspection:</strong> Exchange will be processed after our team conducts a quality inspection to ensure the product meets exchange eligibility criteria</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="step-number">4</div>
                                <div className="step-content">
                                    <p><strong>New Product Dispatch:</strong> Once approved, your exchange product will be dispatched within 3-5 business days</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-box warning">
                            <p><strong>Important:</strong> Exchange is subject to product availability. If the requested size or product is not available, we will offer alternative options or store credit.</p>
                        </div>
                    </section>

                    <section id="refund" className="section">
                        <h2><span className="section-icon">🚫</span> No Refund Policy</h2>
                        <p>Please note that Sati Threads operates under a strict <strong>No Refund Policy</strong>:</p>
                        <ul>
                            <li>Monetary refunds are <strong>not provided</strong> under any circumstances</li>
                            <li>Only size or product exchanges are allowed as per our policy</li>
                            <li>In case of order cancellation before dispatch, refunds may be considered on a case-by-case basis</li>
                        </ul>

                        <div className="info-box important">
                            <p><strong>Before You Order:</strong> Please carefully check product descriptions, size charts, and images before placing your order to avoid any inconvenience.</p>
                        </div>
                    </section>

                    <section id="important" className="section">
                        <h2><span className="section-icon">📌</span> Important Notes</h2>
                        <ul>
                            <li>Sati Threads reserves the right to accept or reject any exchange request based on the conditions outlined in this policy</li>
                            <li>Policy decisions made by Sati Threads are final and binding</li>
                            <li>Return shipping costs for exchanges may be borne by the customer unless the product is defective or incorrect</li>
                            <li>In case of defective or incorrect products, Sati Threads will cover all return shipping costs</li>
                            <li>We recommend using a trackable shipping service for returning products to ensure safe delivery</li>
                        </ul>

                        <div className="contact-box">
                            <h3>Need Help with an Exchange?</h3>
                            <p>Our customer support team is here to assist you with any questions or concerns.</p>
                            <p>📧 Email: <a href="mailto:support@satithreads.com">support@satithreads.com</a></p>
                        </div>
                    </section>
                </main>
            </div>

            <footer className="policy-footer">
                <p>&copy; 2026 Sati Threads. All rights reserved.</p>
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
                    --success: #6B8E6F;
                    --warning: #D48B5B;
                }

                .policy-nav {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    padding: 1.5rem 4rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 248, 240, 0.98);
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                    border-bottom: 1px solid rgba(212, 105, 91, 0.1);
                }

                .logo {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--terracotta);
                    cursor: pointer;
                    letter-spacing: 1px;
                }

                .nav-links {
                    display: flex;
                    gap: 3rem;
                    list-style: none;
                }

                .nav-links li {
                    font-family: 'Lora', serif;
                    font-size: 1rem;
                    font-weight: 500;
                    color: var(--charcoal);
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .nav-links li:hover {
                    color: var(--terracotta);
                }

                .hero {
                    margin-top: 90px;
                    padding: 4rem 4rem 3rem;
                    background: linear-gradient(135deg, #FFF8F0 0%, #F4E8D8 100%);
                    color: var(--charcoal);
                    position: relative;
                    overflow: hidden;
                }

                .hero::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -20%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(139, 157, 131, 0.1), transparent);
                    border-radius: 50%;
                }

                .hero-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                .policy-badge {
                    display: inline-block;
                    padding: 0.5rem 1.5rem;
                    background: var(--sage);
                    color: white;
                    border-radius: 30px;
                    font-size: 0.9rem;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 1.5rem;
                }

                .hero h1 {
                    font-family: 'Playfair Display', serif;
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    line-height: 1.2;
                    color: var(--charcoal);
                }

                .hero p {
                    font-size: 1.2rem;
                    color: var(--charcoal);
                    opacity: 0.8;
                    max-width: 700px;
                }

                .last-updated {
                    margin-top: 2rem;
                    font-size: 0.95rem;
                    color: var(--charcoal);
                    opacity: 0.7;
                }

                .content-wrapper {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 4rem 4rem 6rem;
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 4rem;
                }

                .sidebar {
                    position: sticky;
                    top: 120px;
                    height: fit-content;
                }

                .toc {
                    background: white;
                    border-radius: 15px;
                    padding: 2rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.05);
                    border-left: 4px solid var(--sage);
                }

                .toc h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.3rem;
                    color: var(--charcoal);
                    margin-bottom: 1.5rem;
                }

                .toc-list {
                    list-style: none;
                }

                .toc-list li {
                    margin-bottom: 1rem;
                }

                .toc-list a {
                    color: var(--charcoal);
                    text-decoration: none;
                    font-size: 0.95rem;
                    display: block;
                    padding: 0.5rem 0;
                    transition: all 0.3s ease;
                    border-left: 3px solid transparent;
                    padding-left: 1rem;
                }

                .toc-list a:hover,
                .toc-list a.active {
                    color: var(--sage);
                    border-left-color: var(--sage);
                    transform: translateX(5px);
                }

                .main-content {
                    background: white;
                    border-radius: 20px;
                    padding: 3rem 4rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.05);
                }

                .section {
                    margin-bottom: 3rem;
                    scroll-margin-top: 120px;
                }

                .section h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    color: var(--sage);
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.8rem;
                    border-bottom: 2px solid var(--sand);
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }

                .section-icon {
                    font-size: 1.8rem;
                }

                .section h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.4rem;
                    color: var(--charcoal);
                    margin: 2rem 0 1rem;
                }

                .section p {
                    font-size: 1.05rem;
                    margin-bottom: 1.2rem;
                    color: var(--charcoal);
                    line-height: 1.8;
                }

                .section ul {
                    margin: 1.5rem 0 1.5rem 2rem;
                }

                .section li {
                    font-size: 1.05rem;
                    margin-bottom: 0.8rem;
                    padding-left: 0.5rem;
                    line-height: 1.8;
                }

                .section li::marker {
                    color: var(--sage);
                }

                .info-box {
                    background: linear-gradient(135deg, #E8F4E8, #F0F8F0);
                    padding: 1.8rem;
                    border-radius: 12px;
                    margin: 1.5rem 0;
                    border-left: 4px solid var(--success);
                }

                .info-box.warning {
                    background: linear-gradient(135deg, #FFF3E8, #FFF8F0);
                    border-left-color: var(--warning);
                }

                .info-box.important {
                    background: linear-gradient(135deg, #FFE8E8, #FFF0F0);
                    border-left-color: var(--terracotta);
                }

                .info-box p {
                    margin-bottom: 0;
                }

                .process-steps {
                    margin: 2rem 0;
                }

                .step {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: var(--warm-cream);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }

                .step:hover {
                    transform: translateX(5px);
                    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
                }

                .step-number {
                    flex-shrink: 0;
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(135deg, var(--sage), var(--success));
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.2rem;
                }

                .step-content p {
                    margin: 0;
                }

                .icon-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                    margin: 2rem 0;
                }

                .icon-item {
                    display: flex;
                    align-items: start;
                    gap: 1rem;
                    padding: 1.2rem;
                    background: var(--warm-cream);
                    border-radius: 10px;
                }

                .icon-item-emoji {
                    font-size: 1.8rem;
                    flex-shrink: 0;
                }

                .icon-item-content h4 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.1rem;
                    color: var(--charcoal);
                    margin-bottom: 0.3rem;
                }

                .icon-item-content p {
                    font-size: 0.95rem;
                    margin: 0;
                    opacity: 0.8;
                }

                .contact-box {
                    background: linear-gradient(135deg, #FFF8F0, #F4E8D8);
                    color: var(--charcoal);
                    padding: 2.5rem;
                    border-radius: 15px;
                    margin-top: 3rem;
                    text-align: center;
                    border: 2px solid var(--sage);
                }

                .contact-box h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    color: var(--sage);
                }

                .contact-box p {
                    margin-bottom: 1.5rem;
                    color: var(--charcoal);
                }

                .contact-box a {
                    color: var(--sage);
                    text-decoration: none;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    background: white;
                    border-radius: 8px;
                    display: inline-block;
                    transition: all 0.3s ease;
                    border: 1px solid var(--sage);
                }

                .contact-box a:hover {
                    background: var(--sage);
                    color: white;
                    transform: translateY(-2px);
                }

                .policy-footer {
                    background: var(--charcoal);
                    color: var(--sand);
                    padding: 3rem 4rem;
                    text-align: center;
                }

                .policy-footer p {
                    font-size: 1rem;
                    opacity: 0.8;
                }

                @media (max-width: 1024px) {
                    .content-wrapper {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .sidebar {
                        position: static;
                    }

                    .toc {
                        margin-bottom: 2rem;
                    }

                    .icon-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .policy-nav {
                        padding: 1rem 1.5rem;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }

                    .logo {
                        font-size: 1.5rem;
                        flex-shrink: 0;
                    }

                    .nav-links {
                        gap: 1.2rem;
                        flex-wrap: wrap;
                        justify-content: center;
                        width: 100%;
                        order: 3;
                    }

                    .nav-links li {
                        font-size: 0.85rem;
                    }

                    .hero {
                        padding: 2.5rem 1.5rem;
                        margin-top: 80px;
                    }

                    .hero h1 {
                        font-size: 2rem;
                        line-height: 1.3;
                    }

                    .hero p {
                        font-size: 1rem;
                    }

                    .policy-badge {
                        font-size: 0.75rem;
                        padding: 0.4rem 1rem;
                    }

                    .last-updated {
                        font-size: 0.85rem;
                    }

                    .content-wrapper {
                        padding: 1.5rem 1rem 3rem;
                    }

                    .main-content {
                        padding: 1.5rem 1.2rem;
                    }

                    .section h2 {
                        font-size: 1.5rem;
                    }

                    .section-icon {
                        font-size: 1.4rem;
                    }

                    .section h3 {
                        font-size: 1.2rem;
                    }

                    .section p, .section li {
                        font-size: 0.95rem;
                    }

                    .section ul {
                        margin-left: 1rem;
                    }

                    .contact-box {
                        padding: 1.5rem;
                    }

                    .contact-box h3 {
                        font-size: 1.4rem;
                    }

                    .contact-box p {
                        font-size: 0.95rem;
                    }

                    .icon-grid {
                        gap: 1rem;
                    }

                    .icon-item {
                        padding: 1rem;
                    }

                    .icon-item-emoji {
                        font-size: 1.5rem;
                    }

                    .icon-item-content h4 {
                        font-size: 1rem;
                    }

                    .icon-item-content p {
                        font-size: 0.85rem;
                    }

                    .process-steps {
                        margin: 1.5rem 0;
                    }

                    .step {
                        padding: 1rem;
                        margin-bottom: 1rem;
                    }

                    .step-number {
                        width: 35px;
                        height: 35px;
                        font-size: 1rem;
                    }

                    .info-box {
                        padding: 1.2rem;
                    }

                    .toc {
                        padding: 1.5rem;
                    }

                    .toc h3 {
                        font-size: 1.1rem;
                    }

                    .toc-list a {
                        font-size: 0.85rem;
                    }

                    .policy-footer {
                        padding: 2rem 1.5rem;
                    }
                }
            `}</style>
        </>
    );
}
