"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { X } from "lucide-react";

export default function LoginModal() {
    const { isOpen, callbackUrl, closeModal } = useAuthModal();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to create account");
                setLoading(false);
                return;
            }

            // Auto login after signup
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: callbackUrl || "/home",
            });

            if (result?.error) {
                setError("Account created but login failed. Please try logging in.");
            } else if (result?.ok) {
                closeModal();
                resetModal();
                if (callbackUrl) {
                    window.location.href = callbackUrl;
                } else {
                    window.location.href = "/home";
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !password) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: callbackUrl || "/home",
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else if (result?.ok) {
                closeModal();
                resetModal();
                if (callbackUrl) {
                    window.location.href = callbackUrl;
                } else {
                    window.location.href = "/home";
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: callbackUrl || "/home" });
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
            resetModal();
        }
    };

    const resetModal = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setError("");
        setMode("login");
    };

    const toggleMode = () => {
        setMode(mode === "login" ? "signup" : "login");
        setError("");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
            }}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "420px",
                    margin: "0 1rem",
                    backgroundColor: "#F5F1E8",
                    borderRadius: "16px",
                    padding: "48px 40px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                }}
            >
                {/* Close Button */}
                <button
                    onClick={() => {
                        closeModal();
                        resetModal();
                    }}
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#4A5568",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#1A202C")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#4A5568")}
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: "600",
                        textAlign: "center",
                        marginBottom: "32px",
                        color: "#1A202C",
                        letterSpacing: "-0.5px",
                    }}
                >
                    {mode === "login" ? "Log In" : "Sign Up"}
                </h1>

                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            marginBottom: "16px",
                            padding: "12px 16px",
                            backgroundColor: "#FEE2E2",
                            border: "1px solid #FCA5A5",
                            borderRadius: "8px",
                            color: "#991B1B",
                            fontSize: "14px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
                    {/* Name Input (Signup only) */}
                    {mode === "signup" && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                marginBottom: "16px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "8px",
                                fontSize: "15px",
                                backgroundColor: "#FFFFFF",
                                color: "#1F2937",
                                outline: "none",
                                transition: "all 0.2s",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#2C3E50")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
                        />
                    )}

                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 16px",
                            marginBottom: "16px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "15px",
                            backgroundColor: "#FFFFFF",
                            color: "#1F2937",
                            outline: "none",
                            transition: "all 0.2s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#2C3E50")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
                    />

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 16px",
                            marginBottom: "16px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "15px",
                            backgroundColor: "#FFFFFF",
                            color: "#1F2937",
                            outline: "none",
                            transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#2C3E50")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
                    />

                    {/* Confirm Password (Signup only) */}
                    {mode === "signup" && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                marginBottom: "16px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "8px",
                                fontSize: "15px",
                                backgroundColor: "#FFFFFF",
                                color: "#1F2937",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "#2C3E50")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
                        />
                    )}

                    {/* Privacy Policy Text */}
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: "12px",
                            color: "#6B7280",
                            marginBottom: "20px",
                            lineHeight: "1.5",
                        }}
                    >
                        By {mode === "login" ? "logging in" : "signing up"}, you agree to our
                        <br />
                        <a
                            href="/privacy"
                            style={{
                                color: "#1F2937",
                                textDecoration: "underline",
                                marginRight: "4px",
                            }}
                        >
                            Privacy Policy
                        </a>
                        &
                        <a
                            href="/terms"
                            style={{
                                color: "#1F2937",
                                textDecoration: "underline",
                                marginLeft: "4px",
                            }}
                        >
                            Terms & Conditions
                        </a>
                    </p>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#2C3E50",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "0.5px",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1,
                            transition: "all 0.2s",
                            marginBottom: "16px",
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = "#1a252f";
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = "#2C3E50";
                        }}
                    >
                        {loading ? "Loading..." : mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
                    </button>
                </form>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "24px 0 16px 0",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#D1D5DB",
                        }}
                    />
                    <span
                        style={{
                            padding: "0 12px",
                            fontSize: "12px",
                            color: "#9CA3AF",
                        }}
                    >
                        or
                    </span>
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#D1D5DB",
                        }}
                    />
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleSignIn}
                    style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "#FFFFFF",
                        color: "#1F2937",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        marginBottom: "20px",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#F9FAFB";
                        e.currentTarget.style.borderColor = "#9CA3AF";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                        e.currentTarget.style.borderColor = "#D1D5DB";
                    }}
                >
                    Continue with Google
                </button>

                {/* Toggle between Login/Signup */}
                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={toggleMode}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#6B7280",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1F2937")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                    >
                        {mode === "login" ? (
                            <>
                                New user? <span style={{ textDecoration: "underline" }}>Sign up</span>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <span style={{ textDecoration: "underline" }}>Log in</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
