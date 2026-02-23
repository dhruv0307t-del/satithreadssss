"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupAdminPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secretKey, setSecretKey] = useState("");
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
                body: JSON.stringify({ email, password, name, secretKey }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("✅ Admin created! Redirecting to login...");
                setTimeout(() => router.push("/admin/login"), 2000);
            } else {
                setMessage("❌ " + data.message);
            }
        } catch {
            setMessage("❌ Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .sa-body {
                    background: #faf6ee;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Georgia, 'Times New Roman', serif;
                    padding: 24px;
                    background-image:
                        radial-gradient(ellipse at 20% 50%, rgba(180,155,110,0.08) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 20%, rgba(160,130,90,0.06) 0%, transparent 50%);
                }

                .sa-card {
                    width: 100%;
                    max-width: 440px;
                    background: #f5efe2;
                    border: 1px solid #ddd3bc;
                    border-radius: 4px;
                    padding: 48px 44px 44px;
                    box-shadow: 0 2px 8px rgba(44,31,14,0.12), 0 16px 48px rgba(44,31,14,0.10);
                    animation: saFadeUp 0.5s ease both;
                }

                @keyframes saFadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .sa-eyebrow {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 10px;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: #9e8f7a;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .sa-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 18px;
                    height: 1px;
                    background: #9e8f7a;
                }

                .sa-title {
                    font-size: 26px;
                    font-weight: normal;
                    color: #1a1410;
                    letter-spacing: -0.02em;
                    line-height: 1.25;
                    margin-bottom: 8px;
                }

                .sa-subtitle {
                    font-size: 13.5px;
                    color: #6b5d4a;
                    line-height: 1.6;
                    font-style: italic;
                }

                .sa-divider {
                    width: 100%;
                    height: 1px;
                    background: #ddd3bc;
                    margin: 28px 0;
                }

                .sa-form-group {
                    margin-bottom: 20px;
                }

                .sa-label {
                    display: block;
                    font-size: 12px;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #6b5d4a;
                    font-family: 'Courier New', Courier, monospace;
                    margin-bottom: 7px;
                }

                .sa-input {
                    width: 100%;
                    padding: 11px 14px;
                    background: #fefcf7;
                    border: 1px solid #ddd3bc;
                    border-radius: 3px;
                    font-family: Georgia, serif;
                    font-size: 14.5px;
                    color: #1a1410;
                    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
                    outline: none;
                    -webkit-appearance: none;
                }

                .sa-input::placeholder {
                    color: #9e8f7a;
                    font-style: italic;
                    font-size: 13.5px;
                }

                .sa-input:focus {
                    border-color: #8b7355;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(139,115,85,0.12);
                }

                .sa-secret-group {
                    background: rgba(139,115,85,0.05);
                    border: 1px solid rgba(139,115,85,0.18);
                    border-radius: 3px;
                    padding: 16px;
                    margin-bottom: 28px;
                }

                .sa-hint {
                    margin-top: 8px;
                    font-size: 12px;
                    color: #9e8f7a;
                    font-style: italic;
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                }

                .sa-hint::before {
                    content: '⚠';
                    font-size: 11px;
                    color: #a07040;
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                .sa-alert {
                    padding: 12px 16px;
                    border-radius: 3px;
                    font-size: 13px;
                    margin-bottom: 20px;
                    font-style: italic;
                }

                .sa-alert.success {
                    background: rgba(74, 103, 65, 0.08);
                    border: 1px solid rgba(74, 103, 65, 0.25);
                    color: #2d5a27;
                }

                .sa-alert.error {
                    background: rgba(160, 50, 30, 0.06);
                    border: 1px solid rgba(160, 50, 30, 0.2);
                    color: #8b2a1a;
                }

                .sa-btn {
                    width: 100%;
                    padding: 13px 20px;
                    background: #2c1f0e;
                    color: #faf6ee;
                    border: none;
                    border-radius: 3px;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 12px;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
                    box-shadow: 0 2px 8px rgba(44,31,14,0.18);
                }

                .sa-btn:hover:not(:disabled) {
                    background: #4a3520;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 14px rgba(44,31,14,0.22);
                }

                .sa-btn:active:not(:disabled) {
                    transform: translateY(0);
                    box-shadow: 0 1px 4px rgba(44,31,14,0.16);
                }

                .sa-btn:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .sa-footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 11.5px;
                    color: #9e8f7a;
                    font-style: italic;
                }
            `}</style>

            <div className="sa-body">
                <div className="sa-card">
                    {/* Header */}
                    <div>
                        <p className="sa-eyebrow">System Configuration</p>
                        <h1 className="sa-title">Setup Admin Access</h1>
                        <p className="sa-subtitle">
                            Create the first admin account for this system. A setup secret key is required.
                        </p>
                    </div>

                    <div className="sa-divider" />

                    {/* Message */}
                    {message && (
                        <div className={`sa-alert ${message.startsWith("✅") ? "success" : "error"}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="sa-form-group">
                            <label htmlFor="sa-name" className="sa-label">Name</label>
                            <input
                                id="sa-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="sa-input"
                                placeholder="Full name"
                                autoComplete="name"
                                required
                            />
                        </div>

                        <div className="sa-form-group">
                            <label htmlFor="sa-email" className="sa-label">Email</label>
                            <input
                                id="sa-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="sa-input"
                                placeholder="admin@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="sa-form-group">
                            <label htmlFor="sa-password" className="sa-label">Password</label>
                            <input
                                id="sa-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="sa-input"
                                placeholder="Choose a strong password"
                                autoComplete="new-password"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Secret Key */}
                        <div className="sa-secret-group">
                            <label htmlFor="sa-secret" className="sa-label">
                                Setup Secret Key <span style={{ color: "#a07040", marginLeft: 3 }}>*</span>
                            </label>
                            <input
                                id="sa-secret"
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="sa-input"
                                placeholder="Contact your system administrator"
                                required
                            />
                            <p className="sa-hint">Required to prevent unauthorized admin creation.</p>
                        </div>

                        <button type="submit" disabled={loading} className="sa-btn">
                            {loading ? "Creating..." : "Create Admin"}
                        </button>
                    </form>

                    <p className="sa-footer">This setup can only be completed once per account.</p>
                </div>
            </div>
        </>
    );
}
