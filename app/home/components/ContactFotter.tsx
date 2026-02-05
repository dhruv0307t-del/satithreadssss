"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactFooter() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <section className="contact-footer">
      <div className="contact-grid">
        {/* LEFT - BRAND INFO */}
        <div className="contact-brand">
          <Image
            src="/logo1.png"
            alt="Jonaya"
            width={140}
            height={80}
            className="footer-logo"
          />

          <p className="brand-text">
            Welcome to JONAYA, a homegrown brand based in Jaipur.
            <br />
            Jonaya is a brand by <strong>DIAMOND</strong>.
          </p>

          {/* Social */}
          <div className="social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <span>📷</span>
            </a>
          </div>

          {/* Accordion Items */}
          <div className="accordion">
            <div
              onClick={() => toggleSection("address")}
              className={`accordion-trigger ${expandedSection === "address" ? "expanded" : ""}`}
            >
              <span>📍 Physical Address</span>
              <span className="arrow">▼</span>
            </div>
            {expandedSection === "address" && (
              <div className="accordion-content">
                <p>123 Fashion Street, Jaipur, Rajasthan 302001</p>
              </div>
            )}

            <div
              onClick={() => toggleSection("email")}
              className={`accordion-trigger ${expandedSection === "email" ? "expanded" : ""}`}
            >
              <span>✉️ Drop us an email</span>
              <span className="arrow">▼</span>
            </div>
            {expandedSection === "email" && (
              <div className="accordion-content">
                <p>
                  <a href="mailto:support@jonaya.in">support@jonaya.in</a>
                </p>
              </div>
            )}

            <div
              onClick={() => toggleSection("phone")}
              className={`accordion-trigger ${expandedSection === "phone" ? "expanded" : ""}`}
            >
              <span>📞 Call us anytime</span>
              <span className="arrow">▼</span>
            </div>
            {expandedSection === "phone" && (
              <div className="accordion-content">
                <p>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="footer-actions">
            <button className="filled">About us</button>
            <button className="outline">Contact us</button>
          </div>
        </div>

        {/* CENTER - CATEGORIES */}
        <div className="footer-links">
          <h4
            onClick={() => toggleSection("categories")}
            className={`accordion-header ${expandedSection === "categories" ? "expanded" : ""}`}
          >
            CATEGORIES
            <span className="arrow">▼</span>
          </h4>
          <ul className={expandedSection === "categories" ? "mobile-show" : "mobile-hide"}>
            <li>New Arrivals</li>
            <li>Farshi Salwar Set</li>
            <li>Premium Kurta Sets</li>
            <li>Kurta Sets</li>
            <li>Dresses</li>
            <li>Straight Kurta Sets</li>
            <li>Kameez Sets</li>
            <li>Aesthetic Skirts</li>
            <li>Kurtis</li>
            <li>Peplum Tops</li>
            <li>Track Your Order</li>
          </ul>
        </div>

        {/* RIGHT - POLICIES */}
        <div className="footer-links">
          <h4
            onClick={() => toggleSection("policies")}
            className={`accordion-header ${expandedSection === "policies" ? "expanded" : ""}`}
          >
            POLICIES
            <span className="arrow">▼</span>
          </h4>
          <ul className={expandedSection === "policies" ? "mobile-show" : "mobile-hide"}>
            <li>Search</li>
            <li>About Us</li>
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
            <li>Refund Policy</li>
            <li>Shipping Policy</li>
            <li>Return & Exchange Policy</li>
            <li>Become a Affiliate</li>
            <li>Exchange portal</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .contact-footer {
          padding: 50px 20px;
          background: white;
        }

        .contact-grid {
          display: grid;
          gap: 40px;
        }

        .contact-brand {
          text-align: center;
        }

        .footer-logo {
          margin: 0 auto 20px;
        }

        .brand-text {
          font-size: 15px;
          line-height: 1.6;
          color: #666;
          margin-bottom: 20px;
        }

        .brand-text strong {
          color: #8b7355;
        }

        .social {
          margin: 20px 0;
          display: flex;
          justify-content: center;
        }

        .social a {
          text-decoration: none;
        }

        .social span {
          width: 48px;
          height: 48px;
          border: 2px solid #333;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .social span:hover {
          background: #8b7355;
          border-color: #8b7355;
          transform: scale(1.1);
        }

        .accordion {
          margin: 30px 0;
        }

        .accordion-trigger {
          padding: 16px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .accordion-trigger:hover {
          background: #f9f9f9;
        }

        .accordion-trigger.expanded {
          background: #f5f5f5;
        }

        .accordion-header {
          font-size: 16px;
          color: #8b7355;
          margin-bottom: 20px;
          font-weight: 600;
          letter-spacing: 1px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .arrow {
          font-size: 12px;
          color: #999;
          transition: transform 0.3s ease;
        }

        .expanded .arrow {
          transform: rotate(180deg);
        }

        .accordion-content {
          padding: 16px;
          background: #fafafa;
          border-bottom: 1px solid #e0e0e0;
          animation: slideDown 0.3s ease;
        }

        .accordion-content p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .accordion-content a {
          color: #8b7355;
          text-decoration: none;
        }

        .accordion-content a:hover {
          text-decoration: underline;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }

        .footer-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .footer-actions button {
          flex: 1;
          padding: 14px 20px;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .footer-actions button.filled {
          background: #8b7355;
          color: white;
          border: none;
        }

        .footer-actions button.filled:hover {
          background: #6d5a45;
        }

        .footer-actions button.outline {
          background: white;
          color: #8b7355;
          border: 2px solid #8b7355;
        }

        .footer-actions button.outline:hover {
          background: #8b7355;
          color: white;
        }

        .footer-links {
          text-align: left;
          padding: 0 10px;
        }

        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          padding: 12px 0;
          font-size: 14px;
          color: #666;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .footer-links li:hover {
          color: #8b7355;
          padding-left: 5px;
        }

        /* Desktop and Tablet behavior */
        @media (min-width: 769px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .accordion-header {
            cursor: default;
          }

          .accordion-header .arrow {
            display: none;
          }

          .footer-links ul.mobile-hide {
            display: block !important;
          }
        }

        /* Tablet specific layout */
        @media (min-width: 769px) and (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
          }

          .contact-brand {
            grid-column: span 2;
          }
        }

        /* Mobile specific behavior */
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .accordion-header {
            background: #8b7355; /* Jonaya Brown */
            color: white !important;
            padding: 16px 20px;
            border-radius: 8px;
            border-bottom: none;
            margin-bottom: 10px;
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .accordion-header .arrow {
            color: white;
          }

          .footer-links ul.mobile-hide {
            display: none;
          }

          .footer-links ul.mobile-show {
            display: block;
            padding: 10px 16px;
            background: #fafafa;
            border-radius: 0 0 8px 8px;
            margin-top: -10px;
            margin-bottom: 20px;
          }

          .footer-actions {
            flex-direction: row;
          }
        }

        /* Small mobile */
        @media (max-width: 480px) {
          .footer-actions {
            flex-direction: column;
          }

          .footer-actions button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
