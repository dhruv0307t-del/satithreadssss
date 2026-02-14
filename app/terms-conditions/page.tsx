"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TermsConditionsPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("acceptance");

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
            let current = 'acceptance';

            sections.forEach(section => {
                const sectionTop = (section as HTMLElement).offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id') || 'acceptance';
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
                    <div className="policy-badge">Legal Agreement</div>
                    <h1>Terms & Conditions</h1>
                    <p>Please read these terms carefully before using our website or making a purchase.</p>
                    <div className="last-updated">Last Updated: February 10, 2026</div>
                </div>
            </section>

            <div className="content-wrapper">
                <aside className="sidebar">
                    <nav className="toc">
                        <h3>Contents</h3>
                        <ul className="toc-list">
                            <li><a href="#acceptance" className={activeSection === 'acceptance' ? 'active' : ''}>Acceptance of Terms</a></li>
                            <li><a href="#use-of-site" className={activeSection === 'use-of-site' ? 'active' : ''}>Use of Website</a></li>
                            <li><a href="#account" className={activeSection === 'account' ? 'active' : ''}>Account Registration</a></li>
                            <li><a href="#orders" className={activeSection === 'orders' ? 'active' : ''}>Orders & Payments</a></li>
                            <li><a href="#pricing" className={activeSection === 'pricing' ? 'active' : ''}>Pricing & Availability</a></li>
                            <li><a href="#intellectual" className={activeSection === 'intellectual' ? 'active' : ''}>Intellectual Property</a></li>
                            <li><a href="#prohibited" className={activeSection === 'prohibited' ? 'active' : ''}>Prohibited Uses</a></li>
                            <li><a href="#limitation" className={activeSection === 'limitation' ? 'active' : ''}>Limitation of Liability</a></li>
                            <li><a href="#governing" className={activeSection === 'governing' ? 'active' : ''}>Governing Law</a></li>
                            <li><a href="#changes" className={activeSection === 'changes' ? 'active' : ''}>Changes to Terms</a></li>
                            <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact Information</a></li>
                        </ul>
                    </nav>
                </aside>

                <main className="main-content">
                    <section id="acceptance" className="section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>Welcome to Sati Threads. By accessing and using our website (www.satithreads.com), you accept and agree to be bound by these Terms and Conditions.</p>
                        <p>If you do not agree to these terms, please do not use our website or purchase our products.</p>

                        <div className="highlight-box important">
                            <p><strong>Important:</strong> These terms constitute a legally binding agreement between you and Sati Threads. By placing an order, you confirm that you have read, understood, and accepted these terms.</p>
                        </div>
                    </section>

                    <section id="use-of-site" className="section">
                        <h2>2. Use of Website</h2>

                        <h3>Permitted Use</h3>
                        <p>You may use our website for:</p>
                        <ul>
                            <li>Browsing products and services offered by Sati Threads</li>
                            <li>Making legitimate purchases for personal use</li>
                            <li>Accessing information about our brand and policies</li>
                            <li>Contacting our customer support team</li>
                        </ul>

                        <h3>User Responsibilities</h3>
                        <p>When using our website, you agree to:</p>
                        <ul>
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the confidentiality of your account credentials</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                            <li>Use the website in compliance with all applicable laws and regulations</li>
                        </ul>
                    </section>

                    <section id="account" className="section">
                        <h2>3. Account Registration</h2>
                        <p>While browsing our website is open to all, creating an account may be required for certain features and to complete purchases.</p>

                        <h3>Account Security</h3>
                        <ul>
                            <li>You are responsible for maintaining the security of your account and password</li>
                            <li>You must be at least 18 years old to create an account and make purchases</li>
                            <li>One person may not maintain more than one account</li>
                            <li>You agree to accept responsibility for all activities that occur under your account</li>
                        </ul>

                        <div className="highlight-box">
                            <p><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
                        </div>
                    </section>

                    <section id="orders" className="section">
                        <h2>4. Orders & Payments</h2>

                        <h3>Placing Orders</h3>
                        <p>When you place an order with Sati Threads:</p>
                        <ul>
                            <li>You make an offer to purchase the product(s) at the listed price</li>
                            <li>Your order is subject to acceptance by Sati Threads</li>
                            <li>We will send you an order confirmation email once your order is accepted</li>
                            <li>The contract between you and Sati Threads is formed upon order confirmation</li>
                        </ul>

                        <h3>Payment Terms</h3>
                        <ul>
                            <li>Payment must be made in full at the time of purchase</li>
                            <li>We accept various payment methods including credit/debit cards, UPI, and net banking</li>
                            <li>All payments are processed securely through trusted third-party payment gateways</li>
                            <li>Prices are in Indian Rupees (INR) unless otherwise stated</li>
                        </ul>

                        <h3>Order Cancellation</h3>
                        <p>You may cancel your order before it has been dispatched by contacting our customer support team. Once an order is dispatched, cancellation is not possible, but exchanges may be available as per our Exchange Policy.</p>
                    </section>

                    <section id="pricing" className="section">
                        <h2>5. Pricing & Availability</h2>

                        <h3>Product Pricing</h3>
                        <ul>
                            <li>All prices displayed are inclusive of applicable taxes unless stated otherwise</li>
                            <li>Prices are subject to change without notice</li>
                            <li>The price applicable is the price at the time of order placement</li>
                            <li>We reserve the right to correct pricing errors on our website</li>
                        </ul>

                        <h3>Product Availability</h3>
                        <ul>
                            <li>All orders are subject to product availability</li>
                            <li>In case of unavailability, we will notify you and offer alternatives or a full refund</li>
                            <li>Product images are for illustration purposes and may differ slightly from actual products</li>
                            <li>We strive to display colors accurately, but actual colors may vary depending on your screen</li>
                        </ul>

                        <div className="highlight-box">
                            <p><strong>Pricing Errors:</strong> If a product is listed at an incorrect price due to an error, we reserve the right to cancel the order and issue a full refund, even if the order has been confirmed.</p>
                        </div>
                    </section>

                    <section id="intellectual" className="section">
                        <h2>6. Intellectual Property</h2>
                        <p>All content on the Sati Threads website, including but not limited to:</p>
                        <ul>
                            <li>Text, graphics, logos, images, and photographs</li>
                            <li>Product designs and descriptions</li>
                            <li>Website layout and design</li>
                            <li>Trademarks and brand elements</li>
                        </ul>

                        <p>...are the property of Sati Threads and are protected by Indian and international copyright, trademark, and other intellectual property laws.</p>

                        <h3>Usage Restrictions</h3>
                        <p>You may not:</p>
                        <ul>
                            <li>Reproduce, distribute, or display any content from our website without written permission</li>
                            <li>Use our trademarks, logos, or brand name without authorization</li>
                            <li>Modify or create derivative works based on our content</li>
                            <li>Use our content for commercial purposes without our consent</li>
                        </ul>
                    </section>

                    <section id="prohibited" className="section">
                        <h2>7. Prohibited Uses</h2>
                        <p>You agree not to use our website for any unlawful purpose or in any way that could damage, disable, or impair the website. Prohibited activities include:</p>

                        <ul>
                            <li>Engaging in fraudulent transactions or using stolen payment information</li>
                            <li>Attempting to gain unauthorized access to our systems or user accounts</li>
                            <li>Transmitting viruses, malware, or other harmful code</li>
                            <li>Scraping, data mining, or automated data collection without permission</li>
                            <li>Impersonating another person or entity</li>
                            <li>Harassing, threatening, or abusing other users or our staff</li>
                            <li>Posting false or misleading reviews</li>
                            <li>Attempting to manipulate prices or product availability</li>
                        </ul>

                        <div className="highlight-box important">
                            <p><strong>Violation Consequences:</strong> Violation of these terms may result in immediate account termination, legal action, and reporting to appropriate authorities.</p>
                        </div>
                    </section>

                    <section id="limitation" className="section">
                        <h2>8. Limitation of Liability</h2>
                        <p>To the fullest extent permitted by law:</p>

                        <ul>
                            <li>Sati Threads shall not be liable for any indirect, incidental, special, or consequential damages</li>
                            <li>Our total liability for any claim arising from your use of the website or purchase of products shall not exceed the amount paid for the relevant product</li>
                            <li>We are not responsible for delays or failures in performance caused by circumstances beyond our reasonable control (force majeure)</li>
                            <li>We make no warranties regarding the accuracy, reliability, or completeness of website content</li>
                        </ul>

                        <h3>Product Quality</h3>
                        <p>While we strive to ensure the highest quality of our products, we cannot guarantee that products will be free from all defects. Our liability for defective products is limited to replacement or exchange as per our Exchange Policy.</p>
                    </section>

                    <section id="governing" className="section">
                        <h2>9. Governing Law & Jurisdiction</h2>
                        <p>These Terms and Conditions are governed by and construed in accordance with the laws of India.</p>

                        <p>Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan, India.</p>

                        <h3>Dispute Resolution</h3>
                        <p>In the event of any dispute, we encourage you to first contact our customer support team to resolve the matter amicably. If the dispute cannot be resolved through negotiation, it shall be subject to the jurisdiction mentioned above.</p>
                    </section>

                    <section id="changes" className="section">
                        <h2>10. Changes to Terms</h2>
                        <p>Sati Threads reserves the right to modify or update these Terms and Conditions at any time without prior notice.</p>

                        <ul>
                            <li>Updated terms will be posted on this page with a revised &quot;Last Updated&quot; date</li>
                            <li>Your continued use of the website after changes constitutes acceptance of the new terms</li>
                            <li>We recommend reviewing these terms periodically to stay informed of any updates</li>
                            <li>For significant changes, we may notify users via email or website notification</li>
                        </ul>

                        <div className="highlight-box">
                            <p><strong>Stay Informed:</strong> Check this page regularly for updates. The &quot;Last Updated&quot; date at the top indicates when the terms were last modified.</p>
                        </div>
                    </section>

                    <section id="contact" className="section">
                        <h2>11. Contact Information</h2>
                        <p>If you have any questions, concerns, or feedback regarding these Terms and Conditions, please contact us:</p>

                        <div className="contact-box">
                            <h3>Questions About Our Terms?</h3>
                            <p>Our team is here to help clarify any aspect of these terms.</p>
                            <p>📧 Email: <a href="mailto:support@satithreads.com">support@satithreads.com</a></p>
                            <p>📍 Location: Jaipur, Rajasthan, India</p>
                        </div>

                        <div className="highlight-box" style={{ marginTop: '2rem' }}>
                            <p><strong>Additional Policies:</strong> Please also review our Privacy Policy and Shipping & Exchange Policy for complete information about shopping with Sati Threads.</p>
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
                    bottom: -50%;
                    right: -20%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(201, 169, 97, 0.1), transparent);
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
                    background: var(--gold);
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
                    border-left: 4px solid var(--gold);
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
                    color: var(--gold);
                    border-left-color: var(--gold);
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
                    color: var(--gold);
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
                    color: var(--gold);
                }

                .highlight-box {
                    background: linear-gradient(135deg, #FFF9E8, var(--warm-cream));
                    padding: 2rem;
                    border-radius: 12px;
                    margin: 2rem 0;
                    border-left: 4px solid var(--gold);
                }

                .highlight-box p {
                    margin-bottom: 0;
                }

                .highlight-box.important {
                    background: linear-gradient(135deg, #FFE8E8, #FFF0F0);
                    border-left-color: var(--terracotta);
                }

                .contact-box {
                    background: linear-gradient(135deg, #FFF8F0, #F4E8D8);
                    color: var(--charcoal);
                    padding: 2.5rem;
                    border-radius: 15px;
                    margin-top: 3rem;
                    text-align: center;
                    border: 2px solid var(--gold);
                }

                .contact-box h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    color: var(--gold);
                }

                .contact-box p {
                    margin-bottom: 1.5rem;
                    color: var(--charcoal);
                }

                .contact-box a {
                    color: var(--gold);
                    text-decoration: none;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    background: white;
                    border-radius: 8px;
                    display: inline-block;
                    transition: all 0.3s ease;
                    border: 1px solid var(--gold);
                }

                .contact-box a:hover {
                    background: var(--gold);
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

                    .highlight-box {
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
