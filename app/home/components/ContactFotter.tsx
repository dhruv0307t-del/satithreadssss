"use client";

import Image from "next/image";

export default function ContactFooter() {
  return (
    <section className="contact-footer">
      <div className="contact-grid">
        {/* LEFT */}
        <div className="contact-brand">
          <Image
            src="/logo1.png"
            alt="Jonaya"
            width={140}
            height={80}
          />

          <p className="brand-text">
            Welcome to JONAYA, a homegrown brand based in Jaipur.
            <br />
            Jonaya is a brand by <strong>DIAMOND</strong>.
          </p>

          <div className="social">
            <span>Instagram</span>
          </div>

          <div className="accordion">
            <div>📍 Physical Address</div>
            <div>✉️ Drop us an email</div>
            <div>📞 Call us anytime</div>
          </div>

          <div className="footer-actions">
            <button className="filled">About us</button>
            <button className="outline">Contact us</button>
          </div>
        </div>

        {/* CENTER */}
        <div className="footer-links">
          <h4>CATEGORIES</h4>
          <ul>
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

        {/* RIGHT */}
        <div className="footer-links">
          <h4>POLICIES</h4>
          <ul>
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
    </section>
  );
}
