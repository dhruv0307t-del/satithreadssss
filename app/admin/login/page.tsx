"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            alert("Invalid admin credentials");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f8f5f2] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#e5e5e5]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-[#3b1f23]">
                        Admin Access
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Enter your credentials to manage the store
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#3b1f23] focus:ring-1 focus:ring-[#3b1f23] outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#3b1f23] focus:ring-1 focus:ring-[#3b1f23] outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#3b1f23] text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-black transition-all disabled:opacity-70"
                    >
                        {loading ? "Verifying..." : "Login to Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
