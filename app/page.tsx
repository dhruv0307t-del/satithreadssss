"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

export default function LandingDoor() {
  const doorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
    });

    // cinematic dolly-in
    tl.fromTo(
      doorRef.current,
      { scale: 1 },
      {
        scale: 2.8,
        duration: 2.2,
      }
    );

    // go to home AFTER zoom completes
    tl.call(() => {
      router.push("/home");
    });

    return () => {
      tl.kill();
    };
  }, [router]);

  return (
    <div className="door-wrapper">
      <Image
        ref={doorRef}
        src="/door.jpeg"
        alt="Heritage Door"
        fill
        priority
        className="door-image"
      />
    </div>
  );
}
