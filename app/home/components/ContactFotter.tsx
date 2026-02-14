"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ContactFooter() {
  const router = useRouter();

  const categories = [
    { title: "Kurta Sets", slug: "kurta-sets" },
    { title: "Dupatta Sets", slug: "dupatta-sets" },
    { title: "Skirts", slug: "skirts" },
    { title: "Cord Sets", slug: "cord-sets" },
    { title: "Farshi Salwar Sets", slug: "farshi-salwar-sets" },
    { title: "Tops", slug: "tops" },
    { title: "Short Kurtis", slug: "short-kurtis" },
  ];

  return (
    <section className="contact-footer">
      <div className="contact-grid">
        {/* LEFT - BRAND INFO */}
        <div className="contact-brand">
          <Image
            src="/logo1.png"
            alt="SatiThreads"
            width={140}
            height={80}
            className="footer-logo"
          />

          <p className="brand-text">
            Welcome to SatiThreads - A Traditional Brand of India
          </p>

          {/* Social */}
          <div className="social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <span>📷</span>
            </a>
          </div>

          {/* Contact Details - Always Visible */}
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <p>Plot No. 148-149 Om Shiv Residency in front of RIICO Residential Colony, Sitapura, Jaipur</p>
            </div>

            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <p>
                <a href="mailto:support@satithreads.com">support@satithreads.com</a>
              </p>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <p>
                <a href="tel:+919351903011">+91 93519 03011</a>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="footer-actions">
            <button className="filled" onClick={() => router.push("/about")}>
              About us
            </button>
            <button className="outline" onClick={() => router.push("/contact")}>
              Contact us
            </button>
          </div>
        </div>

        {/* CENTER - CATEGORIES */}
        <div className="footer-links">
          <h4 className="footer-heading">CATEGORIES</h4>
          <ul>
            {categories.map((cat) => (
              <li
                key={cat.slug}
                onClick={() => router.push(`/category/${cat.slug}`)}
              >
                {cat.title}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT - POLICIES */}
        <div className="footer-links">
          <h4 className="footer-heading">POLICIES</h4>
          <ul>
            <li onClick={() => router.push("/products")}>Search</li>
            <li onClick={() => router.push("/about")}>About Us</li>
            <li onClick={() => router.push("/privacy-policy")}>Privacy Policy</li>
            <li onClick={() => router.push("/terms-conditions")}>Terms and Conditions</li>
            <li onClick={() => router.push("/privacy-policy")}>Refund Policy</li>
            <li onClick={() => router.push("/shipping-policy")}>Shipping Policy</li>
            <li onClick={() => router.push("/shipping-policy")}>Return & Exchange Policy</li>
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

        .contact-details {
          margin: 30px 0;
          text-align: left;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .contact-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .contact-icon {
          font-size: 20px;
          min-width: 24px;
        }

        .contact-item p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }

        .contact-item a {
          color: #8b7355;
          text-decoration: none;
        }

        .contact-item a:hover {
          text-decoration: underline;
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

        .footer-heading {
          font-size: 16px;
          color: white;
          background: #c4a5a5;
          margin-bottom: 20px;
          font-weight: 600;
          letter-spacing: 1px;
          padding: 12px 16px;
          border-radius: 4px;
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
