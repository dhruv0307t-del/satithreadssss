"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FestiveSection() {
    const router = useRouter();

    return (
        <section
            className="exclusive-summer-banner-container"
            onClick={() => router.push("/products?category=festive")}
            aria-label="Exclusive Summer Collection Banner"
        >
            {/* Background Image */}
            <div className="banner-background">
                <Image
                    src="/summer-beach-banner-bg.png"
                    alt="Beach Background"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition: 'left center' }}
                />
            </div>

            {/* Right Area: Models & Title */}
            <div className="banner-right-area">
                <div className="banner-models-container">
                    {/* Model 1: Striped Dress */}
                    <div className="banner-model model-striped">
                        <Image
                            src="/uploads/model_1_transparent.png"
                            alt="Model in Striped Dress"
                            fill
                            sizes="(max-width: 768px) 25vw, 15vw"
                            style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                        />
                    </div>
                    {/* Model 2: Floral Pink */}
                    <div className="banner-model model-pink">
                        <Image
                            src="/uploads/model_2_transparent.png"
                            alt="Model in Kurta Set"
                            fill
                            sizes="(max-width: 768px) 30vw, 20vw"
                            style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                        />
                    </div>
                    {/* Model 3: Green Dress */}
                    <div className="banner-model model-green">
                        <Image
                            src="/uploads/model_3_transparent.png"
                            alt="Model in Green Suit"
                            fill
                            sizes="(max-width: 768px) 35vw, 25vw"
                            style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
                        />
                    </div>
                </div>

                {/* Exclusive Summer Collection Text */}
                <div className="banner-text-container">
                    <h2 className="banner-title">EXCLUSIVE SUMMER COLLECTION</h2>
                </div>
            </div>
        </section>
    );
}