"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupAdminPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/setup-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Admin created! Redirecting to login...");
                setTimeout(() => router.push("/admin/login"), 2000);
            } else {
                setMessage("❌ " + data.message);
            }
        } catch (err) {
            setMessage("❌ Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-2">Setup Admin Access</h1>
                <p className="text-gray-500 mb-6 text-sm">
                    Create the first admin account for this system.
                </p>

                {message && (
                    <div className={`p-3 rounded-lg mb-4 text-sm ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-black focus:border-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-black focus:border-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-black focus:border-black"
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Admin"}
                    </button>
                </form>
            </div>
        </div>
    );
}
