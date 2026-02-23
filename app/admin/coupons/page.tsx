"use client";

import { useEffect, useState } from "react";
import { Trash2, Tag, Plus, ToggleLeft, ToggleRight } from "lucide-react";

interface Coupon {
    _id: string;
    code: string;
    discount: number;
    type: "flat" | "percent";
    minCartValue: number;
    imageUrl?: string;
    isActive: boolean;
    createdAt: string;
}

export default function CouponsPage() {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        code: "",
        discount: "",
        type: "flat",
        minCartValue: "0",
        imageUrl: "",
        isActive: true,
    });

    const fetchCoupons = async () => {
        setFetchLoading(true);
        try {
            const res = await fetch("/api/coupons");
            const data = await res.json();
            setCoupons(Array.isArray(data) ? data : []);
        } catch {
            setCoupons([]);
        }
        setFetchLoading(false);
    };

    useEffect(() => { fetchCoupons(); }, []);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload-image", { method: "POST", body: formData });
        const data = await res.json();
        return data.url;
    };

    const submit = async () => {
        if (!form.code || !form.discount) {
            alert("Code and Discount are required");
            return;
        }
        setSubmitting(true);
        const res = await fetch("/api/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setForm({ code: "", discount: "", type: "flat", minCartValue: "0", imageUrl: "", isActive: true });
            fetchCoupons();
        } else {
            alert("Failed to create coupon");
        }
        setSubmitting(false);
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm("Delete this coupon?")) return;
        await fetch(`/api/coupons/${id}`, { method: "DELETE" });
        fetchCoupons();
    };

    const toggleActive = async (c: Coupon) => {
        await fetch(`/api/coupons/${c._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !c.isActive }),
        });
        fetchCoupons();
    };

    return (
        <div className="adm-page">
            {/* Header */}
            <div className="coup-banner">
                <div className="coup-banner-icon"><Tag size={22} /></div>
                <div>
                    <h1 className="coup-page-title">Coupons</h1>
                    <p className="coup-page-sub">Create and manage discount codes</p>
                </div>
                <div className="coup-count-badge">{coupons.length} total</div>
            </div>

            <div className="coup-layout">
                {/* ── LEFT: Create Form ── */}
                <div className="coup-form-card">
                    <div className="coup-form-header">
                        <Plus size={16} />
                        Create Coupon
                    </div>
                    <div className="coup-form-body">
                        <div className="coup-field">
                            <label className="coup-label">Coupon Code</label>
                            <input
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                className="coup-input"
                                placeholder="e.g. WELCOME50"
                                style={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em" }}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div className="coup-field">
                                <label className="coup-label">Discount</label>
                                <input
                                    type="number"
                                    value={form.discount}
                                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                    className="coup-input"
                                    placeholder="Amount"
                                />
                            </div>
                            <div className="coup-field">
                                <label className="coup-label">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="coup-input"
                                >
                                    <option value="flat">Flat ₹</option>
                                    <option value="percent">% Off</option>
                                </select>
                            </div>
                        </div>

                        <div className="coup-field">
                            <label className="coup-label">Min Cart Value (₹)</label>
                            <input
                                type="number"
                                value={form.minCartValue}
                                onChange={(e) => setForm({ ...form, minCartValue: e.target.value })}
                                className="coup-input"
                            />
                        </div>

                        <div className="coup-field">
                            <label className="coup-label">Popup Image <span style={{ color: "var(--adm-muted)", fontWeight: 400 }}>(optional)</span></label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        setSubmitting(true);
                                        const url = await uploadImage(e.target.files[0]);
                                        setForm({ ...form, imageUrl: url });
                                        setSubmitting(false);
                                    }
                                }}
                                className="coup-file-input"
                            />
                            {form.imageUrl && (
                                <img src={form.imageUrl} className="coup-img-preview" alt="Preview" />
                            )}
                        </div>

                        <div className="coup-toggle-row">
                            <span className="coup-label" style={{ margin: 0 }}>Active</span>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                className={`coup-toggle-btn${form.isActive ? " on" : ""}`}
                            >
                                {form.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                            </button>
                        </div>

                        <button
                            onClick={submit}
                            disabled={submitting}
                            className="coup-submit-btn"
                        >
                            {submitting ? "Creating..." : "Create Coupon"}
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: Coupons Table ── */}
                <div className="coup-table-card">
                    <div className="coup-table-header">
                        <span>All Coupons</span>
                        {!fetchLoading && <span className="coup-small-badge">{coupons.length} records</span>}
                    </div>

                    {fetchLoading ? (
                        <div className="coup-loading">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="coup-skeleton-row">
                                    <div className="adm-skeleton" style={{ height: 18, width: 120 }} />
                                    <div className="adm-skeleton" style={{ height: 18, width: 80 }} />
                                    <div className="adm-skeleton" style={{ height: 18, width: 60 }} />
                                    <div className="adm-skeleton" style={{ height: 18, width: 50 }} />
                                </div>
                            ))}
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="coup-empty">
                            <Tag size={32} />
                            <p>No coupons yet. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="coup-table-wrap">
                            <table className="coup-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Discount</th>
                                        <th>Min Order</th>
                                        <th>Image</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((c) => (
                                        <tr key={c._id}>
                                            <td>
                                                <span className="coup-code-chip">{c.code}</span>
                                            </td>
                                            <td>
                                                <span className="coup-discount-val">
                                                    {c.type === "flat" ? `₹${c.discount}` : `${c.discount}%`}
                                                </span>
                                                <span className="coup-type-tag">{c.type}</span>
                                            </td>
                                            <td className="coup-cell-muted">
                                                {c.minCartValue > 0 ? `₹${c.minCartValue}` : "—"}
                                            </td>
                                            <td>
                                                {c.imageUrl ? (
                                                    <img
                                                        src={c.imageUrl}
                                                        className="coup-thumb coup-thumb-click"
                                                        alt={c.code}
                                                        onClick={() => setPreviewImage(c.imageUrl!)}
                                                        title="Click to preview"
                                                    />
                                                ) : (
                                                    <span className="coup-cell-muted">—</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => toggleActive(c)}
                                                    className={`coup-status-badge${c.isActive ? " active" : " inactive"}`}
                                                >
                                                    {c.isActive ? "Active" : "Inactive"}
                                                </button>
                                            </td>
                                            <td className="coup-cell-muted">
                                                {new Date(c.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => deleteCoupon(c._id)}
                                                    className="coup-delete-btn"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Image Lightbox ── */}
            {previewImage && (
                <div className="coup-lightbox" onClick={() => setPreviewImage(null)}>
                    <div className="coup-lightbox-inner" onClick={(e) => e.stopPropagation()}>
                        <button className="coup-lightbox-close" onClick={() => setPreviewImage(null)}>✕</button>
                        <img src={previewImage} className="coup-lightbox-img" alt="Coupon preview" />
                    </div>
                </div>
            )}

            {/* Scoped styles */}
            <style>{`
                .coup-banner {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    margin-bottom: 32px;
                    animation: admFadeUp 0.4s ease both;
                }

                .coup-banner-icon {
                    width: 48px; height: 48px;
                    background: var(--adm-surface);
                    border: 1px solid var(--adm-border);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--adm-accent);
                    flex-shrink: 0;
                }

                .coup-page-title {
                    font-family: 'DM Serif Display', Georgia, serif;
                    font-size: 30px;
                    font-weight: 400;
                    color: var(--adm-text) !important;
                    letter-spacing: -0.5px;
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .coup-page-sub {
                    font-size: 13px;
                    color: var(--adm-text-dim) !important;
                }

                .coup-count-badge {
                    margin-left: auto;
                    background: var(--adm-surface2);
                    border: 1px solid var(--adm-border);
                    border-radius: 20px;
                    padding: 5px 14px;
                    font-size: 12px;
                    color: var(--adm-muted) !important;
                    font-weight: 500;
                }

                /* Layout */
                .coup-layout {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 20px;
                    align-items: start;
                }

                /* Form card */
                .coup-form-card {
                    background: var(--adm-surface);
                    border: 1px solid var(--adm-border);
                    border-radius: 16px;
                    overflow: hidden;
                    animation: admFadeUp 0.4s ease 0.05s both;
                }

                .coup-form-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--adm-border);
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--adm-text) !important;
                    background: var(--adm-surface2);
                }

                .coup-form-body {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .coup-field { display: flex; flex-direction: column; gap: 6px; }

                .coup-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--adm-text) !important;
                    letter-spacing: 0.01em;
                }

                .coup-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: var(--adm-bg);
                    border: 1.5px solid var(--adm-border);
                    border-radius: 8px;
                    font-size: 13px;
                    color: var(--adm-text) !important;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    font-family: 'DM Sans', sans-serif;
                }

                .coup-input:focus {
                    border-color: var(--adm-accent);
                    box-shadow: 0 0 0 3px rgba(74,103,65,0.1);
                }

                .coup-file-input {
                    font-size: 12px;
                    color: var(--adm-text-dim) !important;
                }

                .coup-img-preview {
                    width: 100%;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid var(--adm-border);
                    margin-top: 8px;
                }

                .coup-toggle-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .coup-toggle-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--adm-muted);
                    padding: 0;
                    display: flex;
                    align-items: center;
                    transition: color 0.15s;
                }

                .coup-toggle-btn.on { color: var(--adm-accent); }

                .coup-submit-btn {
                    width: 100%;
                    padding: 11px;
                    background: var(--adm-accent);
                    color: #fff !important;
                    border: none;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: background 0.15s, transform 0.12s;
                }

                .coup-submit-btn:hover:not(:disabled) {
                    background: #3a5332;
                    transform: translateY(-1px);
                }

                .coup-submit-btn:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                /* Table card */
                .coup-table-card {
                    background: var(--adm-surface);
                    border: 1px solid var(--adm-border);
                    border-radius: 16px;
                    overflow: hidden;
                    animation: admFadeUp 0.4s ease 0.1s both;
                }

                .coup-table-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--adm-border);
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--adm-text) !important;
                    background: var(--adm-surface2);
                }

                .coup-small-badge {
                    font-size: 11px;
                    font-weight: 500;
                    color: var(--adm-muted) !important;
                    background: var(--adm-surface);
                    border: 1px solid var(--adm-border);
                    border-radius: 20px;
                    padding: 2px 10px;
                }

                /* Skeleton loading */
                .coup-loading { padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; }
                .coup-skeleton-row { display: flex; gap: 24px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--adm-border); }

                /* Empty */
                .coup-empty {
                    padding: 60px 20px;
                    text-align: center;
                    color: var(--adm-muted) !important;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                }

                /* Table */
                .coup-table-wrap { overflow-x: auto; }

                .coup-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                }

                .coup-table thead tr {
                    background: var(--adm-bg);
                }

                .coup-table th {
                    padding: 11px 16px;
                    text-align: left;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: var(--adm-muted) !important;
                    border-bottom: 1px solid var(--adm-border);
                    white-space: nowrap;
                }

                .coup-table td {
                    padding: 14px 16px;
                    border-bottom: 1px solid var(--adm-border);
                    color: var(--adm-text) !important;
                    vertical-align: middle;
                }

                .coup-table tbody tr:last-child td { border-bottom: none; }

                .coup-table tbody tr:hover { background: var(--adm-bg); }

                /* Code chip */
                .coup-code-chip {
                    display: inline-block;
                    background: var(--adm-bg);
                    border: 1px solid var(--adm-border);
                    border-radius: 6px;
                    padding: 4px 10px;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    color: var(--adm-text) !important;
                }

                /* Discount */
                .coup-discount-val {
                    font-weight: 700;
                    color: var(--adm-accent) !important;
                    font-size: 14px;
                    margin-right: 6px;
                }

                .coup-type-tag {
                    display: inline-block;
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background: var(--adm-surface2);
                    color: var(--adm-muted) !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 600;
                }

                .coup-cell-muted {
                    color: var(--adm-text-dim) !important;
                    font-size: 13px;
                }

                /* Thumbnail */
                .coup-thumb {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 1px solid var(--adm-border);
                }

                /* Status badge (clickable) */
                .coup-status-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.15s;
                }

                .coup-status-badge.active {
                    background: rgba(74,103,65,0.1);
                    color: var(--adm-accent) !important;
                }

                .coup-status-badge.inactive {
                    background: rgba(154,148,136,0.12);
                    color: var(--adm-muted) !important;
                }

                .coup-status-badge:hover { opacity: 0.75; }

                /* Delete button */
                .coup-delete-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--adm-muted) !important;
                    padding: 6px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    transition: all 0.15s;
                }

                .coup-delete-btn:hover {
                    background: rgba(192,57,43,0.08);
                    color: #c0392b !important;
                }

                /* Thumbnail click */
                .coup-thumb-click {
                    cursor: zoom-in;
                    transition: transform 0.15s, box-shadow 0.15s;
                }
                .coup-thumb-click:hover {
                    transform: scale(1.08);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                /* Lightbox */
                .coup-lightbox {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.55);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: admFadeUp 0.2s ease both;
                    backdrop-filter: blur(4px);
                }

                .coup-lightbox-inner {
                    position: relative;
                    background: #fff;
                    border-radius: 16px;
                    padding: 12px;
                    max-width: 480px;
                    width: 90%;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.3);
                    animation: admFadeUp 0.25s cubic-bezier(0.22,1,0.36,1) both;
                }

                .coup-lightbox-img {
                    width: 100%;
                    border-radius: 10px;
                    display: block;
                    max-height: 70vh;
                    object-fit: contain;
                }

                .coup-lightbox-close {
                    position: absolute;
                    top: -12px;
                    right: -12px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #1e1e1a;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    transition: background 0.15s;
                }

                .coup-lightbox-close:hover { background: #c0392b; }

                @media (max-width: 900px) {
                    .coup-layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
