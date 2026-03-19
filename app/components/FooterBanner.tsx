"use client";

import Image from "next/image";

export default function FooterBanner() {
  return (
    <section className="footer-banner">
      <Image
        src="/footer.jpeg"
        alt="Satithreads Culture Banner"
        fill
        priority
        className="footer-banner-img"
      />
    </section>
  );
}
