"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PrivacyPolicyPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("information-collect");

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
            let current = 'information-collect';

            sections.forEach(section => {
                const sectionTop = (section as HTMLElement).offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id') || 'information-collect';
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
                    <div className="policy-badge">Legal Document</div>
                    <h1>Privacy Policy</h1>
                    <p>At Sati Threads, we value your trust and are committed to protecting your personal information.</p>
                    <div className="last-updated">Last Updated: February 10, 2026</div>
                </div>
            </section>

            <div className="content-wrapper">
                <aside className="sidebar">
                    <nav className="toc">
                        <h3>Contents</h3>
                        <ul className="toc-list">
                            <li><a href="#information-collect" className={activeSection === 'information-collect' ? 'active' : ''}>Information We Collect</a></li>
                            <li><a href="#how-we-use" className={activeSection === 'how-we-use' ? 'active' : ''}>How We Use Your Information</a></li>
                            <li><a href="#data-protection" className={activeSection === 'data-protection' ? 'active' : ''}>Data Protection & Security</a></li>
                            <li><a href="#sharing" className={activeSection === 'sharing' ? 'active' : ''}>Sharing of Information</a></li>
                            <li><a href="#cookies" className={activeSection === 'cookies' ? 'active' : ''}>Cookies</a></li>
                            <li><a href="#your-rights" className={activeSection === 'your-rights' ? 'active' : ''}>Your Rights</a></li>
                            <li><a href="#policy-updates" className={activeSection === 'policy-updates' ? 'active' : ''}>Policy Updates</a></li>
                            <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact Us</a></li>
                        </ul>
                    </nav>
                </aside>

                <main className="main-content">
                    <section id="information-collect" className="section">
                        <h2>1. Information We Collect</h2>
                        <p>When you interact with Sati Threads, we may collect the following information:</p>
                        <ul>
                            <li>Personal details such as name, email address, phone number, and shipping address</li>
                            <li>Payment-related information (processed securely via trusted third-party payment gateways; we do not store card details)</li>
                            <li>Order history and preferences</li>
                            <li>Technical data such as IP address, browser type, and device information</li>
                        </ul>
                        <div className="highlight-box">
                            <p><strong>Important:</strong> We never store your complete payment card details on our servers. All payment processing is handled securely by certified payment gateway providers.</p>
                        </div>
                    </section>

                    <section id="how-we-use" className="section">
                        <h2>2. How We Use Your Information</h2>
                        <p>Your information is used to:</p>
                        <ul>
                            <li>Process and deliver your orders efficiently</li>
                            <li>Communicate order updates, confirmations, and support responses</li>
                            <li>Improve our products, services, and website experience</li>
                            <li>Send promotional updates (only if you opt in)</li>
                        </ul>
                        <p>We are committed to using your data responsibly and only for purposes that directly benefit your shopping experience with us.</p>
                    </section>

                    <section id="data-protection" className="section">
                        <h2>3. Data Protection & Security</h2>
                        <p>We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction.</p>
                        <p>Our security measures include:</p>
                        <ul>
                            <li>SSL encryption for all data transmission</li>
                            <li>Secure server infrastructure with regular security audits</li>
                            <li>Access controls limiting data access to authorized personnel only</li>
                            <li>Regular security training for our team members</li>
                        </ul>
                    </section>

                    <section id="sharing" className="section">
                        <h2>4. Sharing of Information</h2>
                        <p>We do not sell, rent, or trade your personal information to third parties. Your data privacy is our priority.</p>
                        <p>Information may only be shared with:</p>
                        <ul>
                            <li><strong>Delivery and logistics partners</strong> – For order fulfillment and tracking</li>
                            <li><strong>Payment service providers</strong> – For secure transaction processing</li>
                            <li><strong>Legal authorities</strong> – If required by law or to protect our rights</li>
                        </ul>
                        <p>All third-party service providers are carefully selected and bound by strict confidentiality agreements.</p>
                    </section>

                    <section id="cookies" className="section">
                        <h2>5. Cookies</h2>
                        <p>Our website uses cookies to enhance user experience, analyze traffic, and improve site functionality.</p>

                        <h3>What are cookies?</h3>
                        <p>Cookies are small text files stored on your device that help us remember your preferences and understand how you use our website.</p>

                        <h3>Types of cookies we use:</h3>
                        <ul>
                            <li><strong>Essential cookies</strong> – Required for basic website functionality</li>
                            <li><strong>Performance cookies</strong> – Help us understand how visitors use our site</li>
                            <li><strong>Functional cookies</strong> – Remember your preferences and settings</li>
                            <li><strong>Marketing cookies</strong> – Used to deliver relevant advertisements</li>
                        </ul>

                        <p>You may disable cookies through your browser settings if you prefer, though this may affect some website features.</p>
                    </section>

                    <section id="your-rights" className="section">
                        <h2>6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li><strong>Access</strong> – Request a copy of the personal data we hold about you</li>
                            <li><strong>Correction</strong> – Update or correct your personal information</li>
                            <li><strong>Deletion</strong> – Request deletion of your data (subject to legal obligations)</li>
                            <li><strong>Opt-out</strong> – Unsubscribe from marketing communications at any time</li>
                            <li><strong>Data portability</strong> – Request your data in a portable format</li>
                            <li><strong>Object</strong> – Object to certain types of data processing</li>
                        </ul>
                        <p>To exercise any of these rights, please contact us using the details provided below.</p>
                    </section>

                    <section id="policy-updates" className="section">
                        <h2>7. Policy Updates</h2>
                        <p>Sati Threads may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.</p>
                        <p>Any changes will be posted on this page with the updated effective date. We encourage you to review this policy regularly to stay informed about how we protect your information.</p>
                        <p>For significant changes, we will notify you via email or through a prominent notice on our website.</p>
                    </section>

                    <section id="contact" className="section">
                        <h2>8. Contact Us</h2>
                        <p>For any questions or concerns regarding this Privacy Policy, please don&apos;t hesitate to reach out to us:</p>

                        <div className="contact-box">
                            <h3>Get in Touch</h3>
                            <p>Our support team is here to help you with any privacy-related questions.</p>
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
                    position: relative;
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
                    top: -30%;
                    right: -15%;
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(212, 105, 91, 0.08), transparent);
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
                    background: var(--terracotta);
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
                    border-left: 4px solid var(--terracotta);
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
                    color: var(--terracotta);
                    border-left-color: var(--terracotta);
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
                    color: var(--terracotta);
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.8rem;
                    border-bottom: 2px solid var(--sand);
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
                    color: var(--terracotta);
                }

                .highlight-box {
                    background: linear-gradient(135deg, var(--sand), var(--warm-cream));
                    padding: 2rem;
                    border-radius: 12px;
                    margin: 2rem 0;
                    border-left: 4px solid var(--gold);
                }

                .highlight-box p {
                    margin-bottom: 0;
                }

                .contact-box {
                    background: linear-gradient(135deg, #FFF8F0, #F4E8D8);
                    color: var(--charcoal);
                    padding: 2.5rem;
                    border-radius: 15px;
                    margin-top: 3rem;
                    text-align: center;
                    border: 2px solid var(--terracotta);
                }

                .contact-box h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    color: var(--terracotta);
                }

                .contact-box p {
                    margin-bottom: 1.5rem;
                    color: var(--charcoal);
                }

                .contact-box a {
                    color: var(--terracotta);
                    text-decoration: none;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    background: white;
                    border-radius: 8px;
                    display: inline-block;
                    transition: all 0.3s ease;
                    border: 1px solid var(--terracotta);
                }

                .contact-box a:hover {
                    background: var(--terracotta);
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

                    .data-grid, .security-grid {
                        gap: 1rem;
                    }

                    .data-item, .security-item {
                        padding: 1rem;
                    }

                    .data-item h4, .security-item h4 {
                        font-size: 1rem;
                    }

                    .data-icon, .security-icon {
                        font-size: 2rem;
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

                    .info-box {
                        padding: 1.2rem;
                    }
                }
            `}</style>
        </>
    );
}
