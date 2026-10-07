"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/coupons")
            .then((res) => res.json())
            .then((data) => {
                // Filter only active coupons
                setCoupons(data.filter((c: any) => c.isActive));
                setLoading(false);
            });
    }, []);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Code ${code} copied!`);
    };

    if (loading) return <div className="text-center py-20">Loading offers...</div>;

    return (
        <div className="bg-[#efe9df] min-h-screen py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-['Vanger'] text-center mb-4 text-[#bf7e81]">
                    Exclusive Offers
                </h1>
                <p className="text-center text-[#bf7e81] mb-16 max-w-2xl mx-auto">
                    Grab the best deals on our handcrafted collection. Use these codes at checkout.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className="bg-[#ffe4e1] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group"
                        >
                            <div className="relative h-48 bg-[#ffe4e1]">
                                {coupon.imageUrl ? (
                                    <Image
                                        src={coupon.imageUrl}
                                        alt={coupon.code}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-[#bf7e81] text-[#ffe4e1] text-3xl font-bold">
                                        {coupon.discount}
                                        {coupon.type === "percent" ? "%" : " FLAT"} OFF
                                    </div>
                                )}
                            </div>

                            <div className="p-6 text-center space-y-4">
                                <h3 className="text-xl font-bold text-[#bf7e81]">
                                    {coupon.discount}
                                    {coupon.type === "percent" ? "%" : "₹"} OFF
                                </h3>
                                <p className="text-sm text-[#bf7e81]">
                                    On orders above ₹{coupon.minCartValue}
                                </p>

                                <div
                                    onClick={() => copyToClipboard(coupon.code)}
                                    className="bg-[#ffe4e1] border-2 border-dashed border-[#bf7e81] rounded-lg py-3 px-4 cursor-pointer hover:bg-gray-50 transition relative"
                                >
                                    <span className="font-mono text-lg font-bold tracking-widest text-[#bf7e81]">
                                        {coupon.code}
                                    </span>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#bf7e81]">
                                        COPY
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {coupons.length === 0 && (
                    <div className="text-center text-[#bf7e81] text-lg">
                        No active coupons at the moment. Check back later!
                    </div>
                )}
            </div>
        </div>
    );
}
