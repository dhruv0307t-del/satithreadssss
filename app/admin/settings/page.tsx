"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, Lock } from "lucide-react";

export default function AdminSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/admin/login");
    }, [status, router]);

    // Password strength
    const getStrength = (val: string) => {
        if (!val) return 0;
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        return score;
    };

    const strengthScore = getStrength(newPassword);
    const strengthColors = ["#c0392b", "#e67e22", "#f1c40f", "#4a6741"];
    const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
    const strengthColor = strengthScore > 0 ? strengthColors[strengthScore - 1] : "#c0392b";
    const strengthLabel = strengthScore > 0 ? strengthLabels[strengthScore - 1] : "Weak";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }
        if (newPassword.length < 8) {
            setMessage({ type: "error", text: "New password must be at least 8 characters." });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: "success", text: "Password changed successfully! Please log in again with your new password." });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage({ type: "error", text: data.error || "Failed to change password." });
            }
        } catch {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        }
        setLoading(false);
    };

    return (
        <>
            <style>{`
                /* ── Settings page scoped styles ── */
                .sets-banner {
                    background: #ede8dc;
                    border-bottom: 1px solid #ddd8cc;
                    padding: 32px 48px 28px;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    animation: setsFadeDown 0.4s ease both;
                }

                @keyframes setsFadeDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @keyframes setsFadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .sets-banner-icon {
                    width: 44px; height: 44px;
                    background: #ffffff;
                    border: 1px solid #ddd8cc;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px;
                }

                .sets-page-title {
                    font-family: 'DM Serif Display', Georgia, serif;
                    font-size: 34px;
                    color: #1e1e1a;
                    font-weight: 400;
                    letter-spacing: -0.5px;
                }

                .sets-content {
                    padding: 40px 48px;
                    max-width: 780px;
                    animation: setsFadeUp 0.4s ease 0.1s both;
                }

                .sets-breadcrumb {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; color: #9a9488; margin-bottom: 28px;
                }

                .sets-breadcrumb .sets-bc-active { color: #1e1e1a; }
                .sets-breadcrumb .sets-bc-sep    { color: #ddd8cc; }

                .sets-card {
                    background: #ffffff;
                    border: 1px solid #ddd8cc;
                    border-radius: 16px;
                    overflow: hidden;
                }

                .sets-card-header {
                    padding: 24px 28px;
                    border-bottom: 1px solid #ddd8cc;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .sets-card-title {
                    font-family: 'DM Serif Display', Georgia, serif;
                    font-size: 22px;
                    font-weight: 400;
                    color: #1e1e1a;
                    letter-spacing: -0.3px;
                }

                .sets-card-badge {
                    background: #ede8dc;
                    border: 1px solid #ddd8cc;
                    border-radius: 20px;
                    padding: 4px 12px;
                    font-size: 11px;
                    color: #9a9488;
                    display: flex; align-items: center; gap: 5px;
                }

                .sets-card-badge::before {
                    content: '';
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #6b8f67;
                }

                .sets-card-body { padding: 28px; }

                .sets-alert {
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 13px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }

                .sets-alert.success {
                    background: rgba(74,103,65,0.08);
                    border: 1px solid rgba(74,103,65,0.22);
                    color: #2d5a27;
                }

                .sets-alert.error {
                    background: rgba(192,57,43,0.06);
                    border: 1px solid rgba(192,57,43,0.18);
                    color: #8b2a1a;
                }

                .sets-logged-in {
                    display: flex; align-items: center; gap: 10px;
                    background: #ede8dc;
                    border: 1px solid #ddd8cc;
                    border-radius: 10px;
                    padding: 12px 16px;
                    margin-bottom: 28px;
                    font-size: 13px;
                    color: #6b6660;
                }

                .sets-logged-in strong { color: #1e1e1a; font-weight: 500; }
                .sets-logged-in svg { flex-shrink: 0; color: #4a6741; }

                .sets-form-fields { display: flex; flex-direction: column; gap: 20px; }

                .sets-field { display: flex; flex-direction: column; gap: 6px; }

                .sets-field-label  { font-size: 13px; font-weight: 500; color: #1e1e1a; }
                .sets-field-hint   { font-size: 11px; color: #9a9488; }

                .sets-input-wrap { position: relative; }

                .sets-input {
                    width: 100%;
                    padding: 11px 44px 11px 14px;
                    background: #ffffff;
                    border: 1.5px solid #ddd8cc;
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    color: #1e1e1a;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    outline: none;
                }

                .sets-input::placeholder { color: #9a9488; }

                .sets-input:focus {
                    border-color: #4a6741;
                    box-shadow: 0 0 0 3px rgba(74,103,65,0.10);
                }

                .sets-input.mismatch {
                    border-color: #c0392b;
                    box-shadow: 0 0 0 3px rgba(192,57,43,0.08);
                }

                .sets-toggle {
                    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: #9a9488; padding: 4px;
                    display: flex; align-items: center;
                    transition: color 0.15s;
                }

                .sets-toggle:hover { color: #1e1e1a; }

                .sets-mismatch-msg {
                    font-size: 11px;
                    color: #c0392b;
                    margin-top: 4px;
                }

                /* Strength bars */
                .sets-strength-wrap { margin-top: 6px; }
                .sets-strength-bars  { display: flex; gap: 4px; margin-bottom: 4px; }
                .sets-strength-bar   {
                    height: 3px; flex: 1; border-radius: 2px;
                    background: #ddd8cc; transition: background 0.3s;
                }
                .sets-strength-label { font-size: 11px; }

                .sets-form-divider {
                    height: 1px;
                    background: #ddd8cc;
                }

                /* Actions footer */
                .sets-card-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 20px 28px;
                    border-top: 1px solid #ddd8cc;
                    background: #ede8dc;
                }

                .sets-footer-notice {
                    font-size: 12px; color: #9a9488;
                    display: flex; align-items: center; gap: 6px;
                }

                .sets-btn-ghost {
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    background: transparent;
                    border: 1.5px solid #ddd8cc;
                    color: #6b6660;
                    transition: all 0.15s;
                }

                .sets-btn-ghost:hover {
                    border-color: #6b6660;
                    color: #1e1e1a;
                }

                .sets-btn-primary {
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    background: #4a6741;
                    color: #fff;
                    border: none;
                    display: flex; align-items: center; gap: 8px;
                    transition: all 0.15s;
                }

                .sets-btn-primary:hover:not(:disabled) { background: #3a5332; }
                .sets-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
            `}</style>

            {/* Page Banner */}
            <div className="sets-banner">
                <div className="sets-banner-icon">🔑</div>
                <h1 className="sets-page-title">Settings</h1>
            </div>

            {/* Content */}
            <div className="sets-content">
                {/* Breadcrumb */}
                <div className="sets-breadcrumb">
                    <span>Admin</span>
                    <span className="sets-bc-sep">›</span>
                    <span className="sets-bc-active">Settings</span>
                </div>

                <div className="sets-card">
                    {/* Card Header */}
                    <div className="sets-card-header">
                        <div className="sets-card-title">Change Password</div>
                        <div className="sets-card-badge">Secure</div>
                    </div>

                    {/* Card Body */}
                    <div className="sets-card-body">
                        {/* Alert */}
                        {message && (
                            <div className={`sets-alert ${message.type}`}>
                                {message.type === "success" ? <Check size={15} /> : <Lock size={15} />}
                                {message.text}
                            </div>
                        )}

                        {/* Logged in as */}
                        <div className="sets-logged-in">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
                            </svg>
                            Logged in as&nbsp;<strong>{session?.user?.email}</strong>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="sets-form-fields">
                                {/* Current Password */}
                                <div className="sets-field">
                                    <label className="sets-field-label" htmlFor="sets-current">Current Password</label>
                                    <div className="sets-input-wrap">
                                        <input
                                            id="sets-current"
                                            type={showCurrent ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="sets-input"
                                            placeholder="Enter your current password"
                                            required
                                        />
                                        <button type="button" className="sets-toggle" onClick={() => setShowCurrent(!showCurrent)}>
                                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="sets-form-divider" />

                                {/* New Password */}
                                <div className="sets-field">
                                    <label className="sets-field-label" htmlFor="sets-new">New Password</label>
                                    <span className="sets-field-hint">Must be at least 8 characters</span>
                                    <div className="sets-input-wrap">
                                        <input
                                            id="sets-new"
                                            type={showNew ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="sets-input"
                                            placeholder="Min. 8 characters"
                                            required
                                            minLength={8}
                                        />
                                        <button type="button" className="sets-toggle" onClick={() => setShowNew(!showNew)}>
                                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {/* Strength bars */}
                                    {newPassword && (
                                        <div className="sets-strength-wrap">
                                            <div className="sets-strength-bars">
                                                {[0, 1, 2, 3].map((i) => (
                                                    <div
                                                        key={i}
                                                        className="sets-strength-bar"
                                                        style={{ background: i < strengthScore ? strengthColor : "#ddd8cc" }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="sets-strength-label" style={{ color: strengthColor }}>
                                                {strengthLabel}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="sets-field">
                                    <label className="sets-field-label" htmlFor="sets-confirm">Confirm New Password</label>
                                    <div className="sets-input-wrap">
                                        <input
                                            id="sets-confirm"
                                            type={showConfirm ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`sets-input${confirmPassword && confirmPassword !== newPassword ? " mismatch" : ""}`}
                                            placeholder="Re-enter new password"
                                            required
                                        />
                                        <button type="button" className="sets-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {confirmPassword && confirmPassword !== newPassword && (
                                        <span className="sets-mismatch-msg">Passwords do not match</span>
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="sets-card-footer" style={{ margin: "28px -28px -28px" }}>
                                <div className="sets-footer-notice">
                                    <Lock size={13} />
                                    You&apos;ll be asked to log in again after changing.
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button
                                        type="button"
                                        className="sets-btn-ghost"
                                        onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setMessage(null); }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                                        className="sets-btn-primary"
                                    >
                                        <Check size={14} strokeWidth={2.5} />
                                        {loading ? "Updating…" : "Update Password"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
