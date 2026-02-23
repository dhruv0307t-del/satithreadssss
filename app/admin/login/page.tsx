"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError("Invalid email or password. Please try again.");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <>
            <style>{`
                .al-body {
                    background: #f0ebe0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                    padding: 24px;
                }

                .al-wrapper {
                    width: 100%;
                    max-width: 520px;
                    animation: alRise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                @keyframes alRise {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .al-strip {
                    height: 4px;
                    background: #0a0a0a;
                    border-radius: 3px 3px 0 0;
                }

                .al-card {
                    background: #ffffff;
                    border-radius: 0 0 20px 20px;
                    padding: 48px 44px 44px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08);
                }

                .al-icon-wrap {
                    width: 52px;
                    height: 52px;
                    background: #f0ebe0;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    color: #0a0a0a;
                }

                .al-header {
                    text-align: center;
                    margin-bottom: 36px;
                }

                .al-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: #0a0a0a;
                    letter-spacing: -0.03em;
                    margin-bottom: 8px;
                }

                .al-subtitle {
                    font-size: 14px;
                    color: #555;
                }

                .al-section-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .al-section-label::before,
                .al-section-label::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #d0d0d0;
                }

                .al-section-label span {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #888;
                    white-space: nowrap;
                }

                .al-form-group { margin-bottom: 18px; }

                .al-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #0a0a0a;
                    margin-bottom: 7px;
                    letter-spacing: -0.01em;
                }

                .al-input-wrap { position: relative; }

                .al-input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #888;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                }

                .al-input {
                    width: 100%;
                    padding: 13px 14px 13px 42px;
                    background: #e8f0f8;
                    border: 1.5px solid transparent;
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 14.5px;
                    color: #0a0a0a;
                    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
                    outline: none;
                    -webkit-appearance: none;
                }

                .al-input::placeholder { color: #888; }

                .al-input:focus {
                    background: #fff;
                    border-color: #0a0a0a;
                    box-shadow: 0 0 0 3px rgba(10,10,10,0.08);
                }

                .al-toggle {
                    position: absolute;
                    right: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #888;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    transition: color 0.15s;
                }

                .al-toggle:hover { color: #0a0a0a; }

                .al-error {
                    background: #fff5f5;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                    border-radius: 10px;
                    padding: 10px 14px;
                    font-size: 13px;
                    margin-bottom: 16px;
                }

                .al-btn {
                    width: 100%;
                    margin-top: 10px;
                    padding: 14px 20px;
                    background: #0a0a0a;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 14.5px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    cursor: pointer;
                    transition: opacity 0.15s, transform 0.12s, box-shadow 0.15s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .al-btn:hover:not(:disabled) {
                    opacity: 0.88;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.22);
                }

                .al-btn:active:not(:disabled) {
                    transform: translateY(0);
                    opacity: 1;
                }

                .al-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .al-footer {
                    text-align: center;
                    margin-top: 24px;
                    font-size: 12px;
                    color: #888;
                }
            `}</style>

            <div className="al-body">
                <div className="al-wrapper">
                    <div className="al-strip" />
                    <div className="al-card">

                        {/* Shield Icon */}
                        <div className="al-icon-wrap">
                            <ShieldCheck size={24} strokeWidth={2} />
                        </div>

                        {/* Header */}
                        <div className="al-header">
                            <h1 className="al-title">Admin Access</h1>
                            <p className="al-subtitle">Enter your credentials to manage the store</p>
                        </div>

                        {/* Section label */}
                        <div className="al-section-label">
                            <span>Credentials</span>
                        </div>

                        {/* Error */}
                        {error && <div className="al-error">{error}</div>}

                        <form onSubmit={handleLogin}>
                            {/* Email */}
                            <div className="al-form-group">
                                <label htmlFor="al-email" className="al-label">Email</label>
                                <div className="al-input-wrap">
                                    <span className="al-input-icon">
                                        <Mail size={16} />
                                    </span>
                                    <input
                                        id="al-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="al-input"
                                        placeholder="admin@example.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="al-form-group">
                                <label htmlFor="al-password" className="al-label">Password</label>
                                <div className="al-input-wrap">
                                    <span className="al-input-icon">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        id="al-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="al-input"
                                        placeholder="••••••••••"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="al-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading} className="al-btn">
                                <ArrowRight size={16} />
                                {loading ? "Verifying..." : "Login to Dashboard"}
                            </button>
                        </form>

                        <p className="al-footer">
                            Secure admin portal · Sati Threads
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
