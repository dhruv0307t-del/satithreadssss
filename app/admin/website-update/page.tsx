"use client";

import { useEffect, useState } from "react";

export default function WebsiteUpdatePage() {
    const [banners, setBanners] = useState({
        heroBannerUrl: "",
        festiveBannerUrl: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/site-config")
            .then((res) => res.json())
            .then((data) => {
                if (data.heroBannerUrl || data.festiveBannerUrl) {
                    setBanners(data);
                }
            });
    }, []);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload-image", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
    };

    const saveConfig = async () => {
        setLoading(true);
        const res = await fetch("/api/site-config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(banners),
        });

        if (res.ok) {
            alert("Website banners updated!");
        } else {
            alert("Failed to update");
        }
        setLoading(false);
    };

    return (
        <div className="admin-main text-black">
            <h1 className="admin-title mb-8">Website Updates</h1>

            <div className="space-y-10 max-w-4xl">
                {/* HERO BANNER */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Home Page Hero Banner</h2>
                    <p className="text-gray-500 mb-6 text-sm">Recommended Size: 1920x800px</p>

                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    setLoading(true);
                                    const url = await uploadImage(e.target.files[0]);
                                    setBanners(prev => ({ ...prev, heroBannerUrl: url }));
                                    setLoading(false);
                                }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                        />

                        {banners.heroBannerUrl ? (
                            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border">
                                <img src={banners.heroBannerUrl} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                No Banner Set
                            </div>
                        )}
                    </div>
                </div>

                {/* FESTIVE BANNER */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Festive Section Banner</h2>
                    <p className="text-gray-500 mb-6 text-sm">Recommended Size: 1400x600px</p>

                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                    setLoading(true);
                                    const url = await uploadImage(e.target.files[0]);
                                    setBanners(prev => ({ ...prev, festiveBannerUrl: url }));
                                    setLoading(false);
                                }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                        />

                        {banners.festiveBannerUrl ? (
                            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border">
                                <img src={banners.festiveBannerUrl} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                No Banner Set
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={saveConfig}
                    disabled={loading}
                    className="px-10 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg"
                >
                    {loading ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
