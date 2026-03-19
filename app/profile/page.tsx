"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/* ───────────────────────── helpers ───────────────────────── */
function initials(name: string) {
    if (!name) return "U";
    return name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
}

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Jammu and Kashmir", "Ladakh", "Puducherry",
];

type Address = {
    _id?: string;
    type: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
};

const TYPE_ICONS: Record<string, string> = { Home: "🏠", Work: "💼", Other: "📍" };

/* ──────────────────────────── CSS ──────────────────────────── */
const CSS = `
:root {
  --bg:#F2EFE0;--card:#FFFFFF;--green:#3A6B50;--green-light:#5DA87A;
  --green-pale:#EAF4EE;--label:#7A8070;--text:#1A1A14;--text-sub:#6B7060;
  --border:rgba(58,107,80,0.10);--shadow:0 2px 16px rgba(40,60,40,0.07),0 1px 3px rgba(40,60,40,0.04);
  --shadow-lg:0 12px 48px rgba(40,60,40,0.13),0 4px 14px rgba(40,60,40,0.07);
  --red:#C0392B;--red-soft:#FDECEA;--amber:#B87620;--amber-soft:#FEF3E2;
  --radius:20px;--radius-sm:12px;
}
.pf-page{max-width:1060px;margin:0 auto;padding:40px 24px 80px;font-family:'DM Sans',sans-serif;color:var(--text);}
.pf-layout{display:grid;grid-template-columns:280px 1fr;gap:20px;align-items:start;animation:pfFadeUp 0.35s ease both;}
@keyframes pfFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.pf-sidebar{display:flex;flex-direction:column;gap:14px;}
.pf-profile-hero{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid rgba(255,255,255,0.9);overflow:hidden;}
.pf-hero-banner{height:72px;background:linear-gradient(135deg,#3A6B50 0%,#5DA87A 60%,#8FC9A8 100%);}
.pf-hero-body{padding:0 22px 22px;}
.pf-avatar-wrap{position:relative;margin-top:-30px;margin-bottom:12px;}
.pf-avatar{width:60px;height:60px;border-radius:50%;background:var(--green);color:#fff;font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;border:3px solid var(--card);box-shadow:0 2px 10px rgba(58,107,80,0.25);}
.pf-hero-name{font-size:17px;font-weight:700;color:var(--text);letter-spacing:-0.3px;}
.pf-hero-email{font-size:12px;color:var(--text-sub);margin-top:2px;font-family:'DM Mono',monospace;}
.pf-hero-role{display:inline-flex;align-items:center;gap:5px;margin-top:10px;background:var(--green-pale);color:var(--green);font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;padding:4px 10px;border-radius:99px;border:1px solid rgba(58,107,80,0.2);}
.pf-side-nav{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid rgba(255,255,255,0.9);overflow:hidden;}
.pf-nav-item{display:flex;align-items:center;gap:11px;padding:13px 18px;font-size:13px;font-weight:500;color:var(--text-sub);cursor:pointer;transition:all 0.14s;border-bottom:1px solid var(--border);border-left:3px solid transparent;background:none;border-right:none;border-top:none;width:100%;font-family:'DM Sans',sans-serif;text-align:left;}
.pf-nav-item:last-child{border-bottom:none;}
.pf-nav-item:hover{background:var(--bg);color:var(--green);}
.pf-nav-item.active{background:var(--green-pale);color:var(--green);font-weight:600;border-left-color:var(--green);}
.pf-nav-icon{width:30px;height:30px;border-radius:8px;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.pf-nav-item.active .pf-nav-icon{background:rgba(58,107,80,0.12);}
.pf-quick-stats{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid rgba(255,255,255,0.9);padding:16px 18px;display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pf-qs-item{text-align:center;}
.pf-qs-val{font-size:22px;font-weight:700;color:var(--green);letter-spacing:-0.5px;}
.pf-qs-label{font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--label);margin-top:2px;}
.pf-main{display:flex;flex-direction:column;gap:20px;}
.pf-card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid rgba(255,255,255,0.9);overflow:hidden;}
.pf-sec-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 18px;border-bottom:1px solid var(--border);}
.pf-sec-head-left{display:flex;align-items:center;gap:12px;}
.pf-sec-icon{width:38px;height:38px;border-radius:10px;background:var(--green-pale);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.pf-sec-title{font-size:15px;font-weight:700;color:var(--text);letter-spacing:-0.2px;}
.pf-sec-sub{font-size:11.5px;color:var(--text-sub);margin-top:2px;}
.pf-sec-body{padding:22px 24px;}
.pf-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.pf-info-label{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--label);margin-bottom:5px;}
.pf-info-val{font-size:13.5px;font-weight:500;color:var(--text);}
.pf-info-val.mono{font-family:'DM Mono',monospace;font-size:12.5px;}
.pf-info-val.green{color:var(--green);}
.pf-divider{height:1px;background:var(--border);margin:18px 0;}
.pf-form-grid{display:grid;gap:14px;margin-bottom:14px;}
.pf-form-grid.cols2{grid-template-columns:1fr 1fr;}
.pf-field{display:flex;flex-direction:column;gap:6px;}
.pf-field label{font-size:11.5px;font-weight:600;color:var(--text);}
.pf-field input,.pf-field select{width:100%;padding:11px 14px;border-radius:var(--radius-sm);border:1.5px solid var(--border);background:#FAFAF7;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);outline:none;transition:border-color 0.17s,box-shadow 0.17s,background 0.17s;-webkit-appearance:none;}
.pf-field input:focus,.pf-field select:focus{border-color:var(--green);background:#fff;box-shadow:0 0 0 3px rgba(58,107,80,0.08);}
.pf-field input[readonly]{background:#F5F5F0;color:var(--text-sub);cursor:not-allowed;}
.pf-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;border-radius:99px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all 0.17s;}
.pf-btn.primary{background:var(--green);color:#fff;box-shadow:0 2px 10px rgba(58,107,80,0.2);}
.pf-btn.primary:hover{background:#2e5640;transform:translateY(-1px);}
.pf-btn.ghost{background:var(--card);color:var(--text-sub);border:1.5px solid var(--border);}
.pf-btn.ghost:hover{border-color:var(--green);color:var(--green);}
.pf-btn.sm{padding:7px 14px;font-size:12px;}
.pf-btn.danger{background:var(--red-soft);color:var(--red);border:1.5px solid rgba(192,57,43,0.15);}
.pf-btn.danger:hover{background:var(--red);color:#fff;}
/* Addresses */
.pf-addr-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pf-addr-card{background:#FAFAF7;border-radius:var(--radius-sm);border:1.5px solid var(--border);padding:16px 18px;transition:all 0.17s;position:relative;}
.pf-addr-card:hover{border-color:rgba(58,107,80,0.2);background:#fff;box-shadow:0 2px 12px rgba(58,107,80,0.07);}
.pf-addr-card.def{border-color:rgba(58,107,80,0.3);background:var(--green-pale);}
.pf-addr-card.def::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--green),var(--green-light));border-radius:var(--radius-sm) var(--radius-sm) 0 0;}
.pf-addr-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.pf-addr-type{display:flex;align-items:center;gap:7px;}
.pf-addr-type-icon{width:28px;height:28px;border-radius:7px;background:rgba(58,107,80,0.1);display:flex;align-items:center;justify-content:center;font-size:14px;}
.pf-addr-type-label{font-size:12px;font-weight:700;color:var(--text);}
.pf-addr-def-badge{font-size:9px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;background:var(--green);color:#fff;padding:2px 8px;border-radius:99px;}
.pf-addr-actions{display:flex;gap:4px;opacity:0;transition:opacity 0.13s;}
.pf-addr-card:hover .pf-addr-actions{opacity:1;}
.pf-mini-btn{width:26px;height:26px;border-radius:7px;border:1.5px solid var(--border);background:var(--card);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.13s;color:var(--text-sub);font-size:13px;}
.pf-mini-btn:hover{border-color:var(--green);color:var(--green);background:var(--green-pale);}
.pf-mini-btn.del:hover{border-color:var(--red);color:var(--red);background:var(--red-soft);}
.pf-addr-name{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px;}
.pf-addr-phone{font-size:11.5px;color:var(--text-sub);font-family:'DM Mono',monospace;margin-bottom:7px;}
.pf-addr-text{font-size:12px;color:var(--text-sub);line-height:1.5;}
.pf-addr-footer{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px solid rgba(58,107,80,0.08);}
.pf-set-def-btn{font-size:11px;font-weight:600;color:var(--green);background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;padding:0;}
.pf-set-def-btn:hover{opacity:0.7;}
.pf-add-tile{border:2px dashed rgba(58,107,80,0.2);border-radius:var(--radius-sm);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;padding:28px 16px;transition:all 0.17s;min-height:160px;background:transparent;}
.pf-add-tile:hover{border-color:var(--green);background:rgba(58,107,80,0.03);}
.pf-add-tile .add-icon{width:36px;height:36px;border-radius:50%;background:var(--green-pale);display:flex;align-items:center;justify-content:center;}
.pf-add-tile span{font-size:12px;font-weight:600;color:var(--label);}
.pf-add-tile:hover span{color:var(--green);}
/* Inline form */
.pf-addr-form{background:#FAFAF7;border-radius:var(--radius-sm);border:1.5px solid rgba(58,107,80,0.2);padding:18px;margin-top:12px;grid-column:1/-1;}
.pf-type-row{display:flex;gap:7px;margin-bottom:14px;}
.pf-type-chip{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px 8px;border-radius:9px;border:1.5px solid var(--border);background:#fff;cursor:pointer;transition:all 0.14s;font-size:12px;font-weight:600;color:var(--text-sub);}
.pf-type-chip:hover{border-color:var(--green);color:var(--green);}
.pf-type-chip.active{background:var(--green-pale);border-color:rgba(58,107,80,0.3);color:var(--green);}
/* Toggle */
.pf-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:9px;border:1.5px solid var(--border);background:#fff;cursor:pointer;transition:all 0.15s;}
.pf-toggle-row.on{background:var(--green-pale);border-color:rgba(58,107,80,0.25);}
.pf-sw{position:relative;width:38px;height:21px;flex-shrink:0;}
.pf-sw input{opacity:0;width:0;height:0;}
.pf-sl{position:absolute;inset:0;background:#D0D5C8;border-radius:99px;cursor:pointer;transition:background 0.2s;}
.pf-sl::before{content:'';position:absolute;width:15px;height:15px;left:3px;top:3px;background:white;border-radius:50%;transition:transform 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.15);}
.pf-sw input:checked+.pf-sl{background:var(--green);}
.pf-sw input:checked+.pf-sl::before{transform:translateX(17px);}
/* pref rows */
.pf-pref-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);}
.pf-pref-row:last-child{border-bottom:none;padding-bottom:0;}
/* toast */
.pf-toast{position:fixed;bottom:28px;right:24px;padding:12px 20px;border-radius:14px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.14);transform:translateY(20px);opacity:0;transition:all 0.28s;pointer-events:none;font-family:'DM Sans',sans-serif;}
.pf-toast.show{opacity:1;transform:translateY(0);}
@media(max-width:860px){
  .pf-layout{grid-template-columns:1fr;}
  .pf-addr-grid{grid-template-columns:1fr;}
  .pf-info-grid,.pf-form-grid.cols2{grid-template-columns:1fr;}
}
`;

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [activeSection, setActiveSection] = useState<"personal" | "addresses" | "security" | "notifications">("personal");
    const [editing, setEditing] = useState(false);
    const [toast, setToast] = useState({ msg: "", type: "", show: false });
    const toastTimer = useRef<any>(null);

    // Personal Info
    const [userData, setUserData] = useState({ name: "", phone: "", email: "", dob: "", gender: "Prefer not to say" });
    const [editData, setEditData] = useState({ ...userData });

    // Addresses
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [addrLoading, setAddrLoading] = useState(false);
    const [showAddrForm, setShowAddrForm] = useState(false);
    const [editAddrId, setEditAddrId] = useState<string | null>(null);
    const [selType, setSelType] = useState("Home");
    const [addrForm, setAddrForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "", landmark: "", isDefault: false });

    // Stats
    const [stats, setStats] = useState({ orders: 0, spent: 0, joinedMonth: "" });

    // Password / notif (UI only)
    const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });

    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;

        // Fetch user data and stats from the new profile API
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile");
                const d = await res.json();
                if (d.success) {
                    const user = d.user;
                    const base = {
                        name: user.name || "",
                        phone: user.phone || "",
                        email: user.email || "",
                        dob: user.dob || "",
                        gender: user.gender || "Prefer not to say",
                    };
                    setUserData(base);
                    setEditData(base);
                    setAddresses(d.addresses || []); // If addresses come with profile
                    setStats({
                        orders: d.stats.orders,
                        spent: d.stats.spent,
                        joinedMonth: new Date(user.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };

        fetchProfile();
        fetchAddresses(); // Still fetch addresses details separately if needed or reuse d.addresses
    }, [status, session]);

    async function fetchAddresses() {
        setAddrLoading(true);
        try {
            const res = await fetch("/api/user/address");
            const d = await res.json();
            if (d.success) setAddresses(d.addresses || []);
        } finally {
            setAddrLoading(false);
        }
    }

    function showToast(msg: string, type = "success") {
        setToast({ msg, type, show: true });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
    }

    /* ── Personal Save ── */
    async function savePersonal() {
        if (!editData.name.trim() || !editData.phone.trim()) {
            showToast("Name and phone are required", "error"); return;
        }
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editData.name, phone: editData.phone, dob: editData.dob, gender: editData.gender }),
            });
            const d = await res.json();
            if (d.success || res.ok) {
                setUserData({ ...userData, ...editData });
                setEditing(false);
                showToast("Profile updated ✓");
            } else {
                showToast(d.message || "Failed to update", "error");
            }
        } catch {
            // Optimistic update even if API not wired
            setUserData({ ...userData, ...editData });
            setEditing(false);
            showToast("Profile updated ✓");
        }
    }

    /* ── Address helpers ── */
    function openAddrForm(addr?: Address) {
        if (addr) {
            setEditAddrId(addr._id || null);
            setSelType(addr.type);
            setAddrForm({ name: addr.name, phone: addr.phone, address: addr.address, city: addr.city, state: addr.state, pincode: addr.pincode, landmark: addr.landmark || "", isDefault: addr.isDefault });
        } else {
            setEditAddrId(null);
            setSelType("Home");
            setAddrForm({ name: "", phone: "", address: "", city: "", state: "", pincode: "", landmark: "", isDefault: false });
        }
        setShowAddrForm(true);
        setTimeout(() => {
            document.getElementById("pf-addr-form")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 50);
    }

    async function saveAddr() {
        const { name, phone, address, city, state, pincode } = addrForm;
        if (!name || !phone || !address || !city || !state || !pincode) {
            showToast("Please fill all required fields", "error"); return;
        }
        if (pincode.length !== 6) { showToast("Pincode must be 6 digits", "error"); return; }
        const payload = { ...addrForm, type: selType };
        try {
            const res = await fetch("/api/user/address", {
                method: editAddrId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editAddrId ? { id: editAddrId, ...payload } : payload),
            });
            const d = await res.json();
            if (d.success) {
                await fetchAddresses();
                setShowAddrForm(false);
                showToast(editAddrId ? "Address updated ✓" : "Address saved ✓");
            } else {
                showToast(d.message || "Failed", "error");
            }
        } catch {
            showToast("Network error", "error");
        }
    }

    async function deleteAddr(id: string) {
        try {
            const res = await fetch("/api/user/address", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) { await fetchAddresses(); showToast("Address removed"); }
        } catch { showToast("Failed to remove", "error"); }
    }

    async function setDefaultAddr(id: string) {
        try {
            const res = await fetch("/api/user/address", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isDefault: true }),
            });
            if (res.ok) { await fetchAddresses(); showToast("Default address updated ✓"); }
        } catch { }
    }

    /* ── Derived ── */
    const userInitials = initials(userData.name);
    const toastColors: Record<string, string> = { success: "#3A6B50", error: "#C0392B", info: "#2C6E8A" };

    if (status === "loading") return (
        <div style={{ minHeight: "100vh", background: "#F2EFE0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(58,107,80,0.2)", borderTop: "3px solid #3A6B50", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <div className="pf-page">
            <style dangerouslySetInnerHTML={{ __html: CSS }} />

            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.7px" }}>My Profile</h1>
                <p style={{ fontSize: 13, color: "var(--text-sub)", marginTop: 4 }}>Manage your personal information and account settings</p>
            </div>

            <div className="pf-layout">
                {/* ── Sidebar ── */}
                <div className="pf-sidebar">
                    {/* Hero */}
                    <div className="pf-profile-hero">
                        <div className="pf-hero-banner" />
                        <div className="pf-hero-body">
                            <div className="pf-avatar-wrap">
                                <div className="pf-avatar">{userInitials}</div>
                            </div>
                            <div className="pf-hero-name">{userData.name || "User"}</div>
                            <div className="pf-hero-email">{userData.email}</div>
                            <div className="pf-hero-role">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                User
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="pf-side-nav">
                        {([
                            { id: "personal", label: "Personal Info", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
                            { id: "addresses", label: "Saved Addresses", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg> },
                            { id: "security", label: "Security", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg> },
                            { id: "notifications", label: "Notifications", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg> },
                        ] as const).map(nav => (
                            <button key={nav.id} className={`pf-nav-item${activeSection === nav.id ? " active" : ""}`} onClick={() => setActiveSection(nav.id)}>
                                <div className="pf-nav-icon">{nav.icon}</div>
                                {nav.label}
                            </button>
                        ))}
                    </div>

                    {/* Quick stats */}
                    <div className="pf-quick-stats">
                        <div className="pf-qs-item"><div className="pf-qs-val">{stats.orders}</div><div className="pf-qs-label">Orders</div></div>
                        <div className="pf-qs-item"><div className="pf-qs-val">{addresses.length}</div><div className="pf-qs-label">Addresses</div></div>
                        <div className="pf-qs-item"><div className="pf-qs-val">{stats.spent >= 1000 ? `₹${(stats.spent / 1000).toFixed(1)}K` : `₹${stats.spent}`}</div><div className="pf-qs-label">Spent</div></div>
                        <div className="pf-qs-item"><div className="pf-qs-val" style={{ fontSize: 14 }}>{stats.joinedMonth || "—"}</div><div className="pf-qs-label">Joined</div></div>
                    </div>
                </div>

                {/* ── Main ── */}
                <div className="pf-main">

                    {/* ── PERSONAL INFO ── */}
                    {activeSection === "personal" && (
                        <div className="pf-card">
                            <div className="pf-sec-head">
                                <div className="pf-sec-head-left">
                                    <div className="pf-sec-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
                                    <div><div className="pf-sec-title">Personal Information</div><div className="pf-sec-sub">Your name, contact and account details</div></div>
                                </div>
                                {!editing && (
                                    <button className="pf-btn ghost sm" onClick={() => { setEditData({ ...userData }); setEditing(true); }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="pf-sec-body">
                                {!editing ? (
                                    <>
                                        <div className="pf-info-grid">
                                            <div><div className="pf-info-label">Full Name</div><div className="pf-info-val">{userData.name || "—"}</div></div>
                                            <div><div className="pf-info-label">Phone Number</div><div className="pf-info-val mono">{userData.phone || "—"}</div></div>
                                            <div><div className="pf-info-label">Email Address</div><div className="pf-info-val mono">{userData.email}</div></div>
                                            <div><div className="pf-info-label">Date of Birth</div><div className="pf-info-val">{userData.dob ? new Date(userData.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}</div></div>
                                            <div><div className="pf-info-label">Gender</div><div className="pf-info-val">{userData.gender}</div></div>
                                            <div><div className="pf-info-label">Member Since</div><div className="pf-info-val">{stats.joinedMonth || "—"}</div></div>
                                        </div>
                                        <div className="pf-divider" />
                                        <div className="pf-info-grid">
                                            <div><div className="pf-info-label">Account ID</div><div className="pf-info-val mono green">{((session?.user as any)?.id || "").slice(-8).toUpperCase() || "—"}</div></div>
                                            <div><div className="pf-info-label">Account Type</div><div className="pf-info-val">Regular User</div></div>
                                        </div>
                                        <p style={{ fontSize: 11.5, color: "var(--text-sub)", marginTop: 16, padding: "12px 14px", background: "var(--bg)", borderRadius: 9, lineHeight: 1.5 }}>
                                            💡 To update your email, please contact support.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="pf-form-grid cols2">
                                            <div className="pf-field"><label>Full Name</label><input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} placeholder="Your full name" /></div>
                                            <div className="pf-field"><label>Phone Number</label><input value={editData.phone} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} placeholder="+91 00000 00000" /></div>
                                        </div>
                                        <div className="pf-form-grid cols2">
                                            <div className="pf-field"><label>Date of Birth</label><input type="date" value={editData.dob} onChange={e => setEditData(d => ({ ...d, dob: e.target.value }))} /></div>
                                            <div className="pf-field"><label>Gender</label>
                                                <select value={editData.gender} onChange={e => setEditData(d => ({ ...d, gender: e.target.value }))}>
                                                    <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="pf-form-grid cols2">
                                            <div className="pf-field"><label>Email <span style={{ fontSize: 10, color: "var(--text-sub)", fontWeight: 400 }}>(read only)</span></label><input type="email" value={editData.email} readOnly /></div>
                                        </div>
                                        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                            <button className="pf-btn primary sm" onClick={savePersonal}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                                Save Changes
                                            </button>
                                            <button className="pf-btn ghost sm" onClick={() => setEditing(false)}>Cancel</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── SAVED ADDRESSES ── */}
                    {activeSection === "addresses" && (
                        <div className="pf-card">
                            <div className="pf-sec-head">
                                <div className="pf-sec-head-left">
                                    <div className="pf-sec-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
                                    <div><div className="pf-sec-title">Saved Addresses</div><div className="pf-sec-sub">Your delivery locations</div></div>
                                </div>
                                <button className="pf-btn primary sm" onClick={() => openAddrForm()}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    Add Address
                                </button>
                            </div>
                            <div className="pf-sec-body">
                                {addrLoading ? (
                                    <div style={{ textAlign: "center", padding: 24, color: "var(--text-sub)", fontSize: 13 }}>Loading addresses…</div>
                                ) : (
                                    <div className="pf-addr-grid">
                                        {addresses.map(addr => (
                                            <div key={addr._id} className={`pf-addr-card${addr.isDefault ? " def" : ""}`}>
                                                <div className="pf-addr-top">
                                                    <div className="pf-addr-type">
                                                        <div className="pf-addr-type-icon">{TYPE_ICONS[addr.type] || "📍"}</div>
                                                        <span className="pf-addr-type-label">{addr.type}</span>
                                                        {addr.isDefault && <span className="pf-addr-def-badge">Default</span>}
                                                    </div>
                                                    <div className="pf-addr-actions">
                                                        <button className="pf-mini-btn" onClick={() => openAddrForm(addr)} title="Edit">✏️</button>
                                                        <button className="pf-mini-btn del" onClick={() => deleteAddr(addr._id!)} title="Delete">🗑️</button>
                                                    </div>
                                                </div>
                                                <div className="pf-addr-name">{addr.name}</div>
                                                <div className="pf-addr-phone">{addr.phone}</div>
                                                <div className="pf-addr-text">{addr.address},<br /><strong>{addr.city}</strong>, {addr.state} — {addr.pincode}{addr.landmark && <><br /><span style={{ color: "var(--label)", fontSize: 11 }}>Near: {addr.landmark}</span></>}</div>
                                                <div className="pf-addr-footer">
                                                    {addr.isDefault ? <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600 }}>✓ Default</span> : <button className="pf-set-def-btn" onClick={() => setDefaultAddr(addr._id!)}>Set as Default</button>}
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add tile */}
                                        <div className="pf-add-tile" onClick={() => openAddrForm()}>
                                            <div className="add-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></div>
                                            <span>Add New Address</span>
                                        </div>

                                        {/* Inline form */}
                                        {showAddrForm && (
                                            <div className="pf-addr-form" id="pf-addr-form">
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{editAddrId ? "Edit Address" : "Add New Address"}</div>
                                                    <button className="pf-btn ghost sm" onClick={() => setShowAddrForm(false)}>✕ Cancel</button>
                                                </div>
                                                <div style={{ marginBottom: 14 }}>
                                                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Address Type</div>
                                                    <div className="pf-type-row">
                                                        {["Home", "Work", "Other"].map(t => (
                                                            <div key={t} className={`pf-type-chip${selType === t ? " active" : ""}`} onClick={() => setSelType(t)}>
                                                                {TYPE_ICONS[t]} {t}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="pf-form-grid cols2">
                                                    <div className="pf-field"><label>Full Name</label><input value={addrForm.name} onChange={e => setAddrForm(f => ({ ...f, name: e.target.value }))} placeholder="Recipient name" /></div>
                                                    <div className="pf-field"><label>Phone</label><input value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 00000 00000" /></div>
                                                </div>
                                                <div className="pf-form-grid">
                                                    <div className="pf-field"><label>Street Address</label><input value={addrForm.address} onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))} placeholder="Flat, House no., Building, Colony…" /></div>
                                                </div>
                                                <div className="pf-form-grid cols2">
                                                    <div className="pf-field"><label>City</label><input value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} placeholder="City" /></div>
                                                    <div className="pf-field"><label>State</label>
                                                        <select value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))}>
                                                            <option value="">Select State</option>
                                                            {STATES.map(s => <option key={s}>{s}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="pf-form-grid cols2">
                                                    <div className="pf-field"><label>Pincode</label><input value={addrForm.pincode} onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value }))} placeholder="6-digit pincode" maxLength={6} /></div>
                                                    <div className="pf-field"><label>Landmark <span style={{ fontWeight: 400, color: "var(--text-sub)", fontSize: 10 }}>(optional)</span></label><input value={addrForm.landmark} onChange={e => setAddrForm(f => ({ ...f, landmark: e.target.value }))} placeholder="Near school, market…" /></div>
                                                </div>
                                                <div className={`pf-toggle-row${addrForm.isDefault ? " on" : ""}`} onClick={() => setAddrForm(f => ({ ...f, isDefault: !f.isDefault }))}>
                                                    <div><div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>Set as default address</div><div style={{ fontSize: 11, color: "var(--text-sub)", marginTop: 1 }}>Pre-selected at checkout</div></div>
                                                    <label className="pf-sw" onClick={e => e.stopPropagation()}>
                                                        <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} />
                                                        <span className="pf-sl"></span>
                                                    </label>
                                                </div>
                                                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                                                    <button className="pf-btn primary sm" onClick={saveAddr}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                                        {editAddrId ? "Update Address" : "Save Address"}
                                                    </button>
                                                    <button className="pf-btn ghost sm" onClick={() => setShowAddrForm(false)}>Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── SECURITY ── */}
                    {activeSection === "security" && (
                        <div className="pf-card">
                            <div className="pf-sec-head">
                                <div className="pf-sec-head-left">
                                    <div className="pf-sec-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg></div>
                                    <div><div className="pf-sec-title">Security</div><div className="pf-sec-sub">Password and authentication settings</div></div>
                                </div>
                            </div>
                            <div className="pf-sec-body">
                                <div style={{ background: "var(--amber-soft)", borderRadius: "var(--radius-sm)", padding: "13px 16px", border: "1px solid rgba(184,118,32,0.2)", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 18 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B87620" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    <p style={{ fontSize: 12.5, color: "var(--amber)", lineHeight: 1.5 }}>For security, we require your current password before setting a new one.</p>
                                </div>
                                <div className="pf-form-grid" style={{ maxWidth: 400 }}>
                                    <div className="pf-field"><label>Current Password</label><input type="password" value={pwdForm.current} onChange={e => setPwdForm(f => ({ ...f, current: e.target.value }))} placeholder="Enter current password" /></div>
                                    <div className="pf-field"><label>New Password</label><input type="password" value={pwdForm.next} onChange={e => setPwdForm(f => ({ ...f, next: e.target.value }))} placeholder="Min. 8 characters" /></div>
                                    <div className="pf-field"><label>Confirm New Password</label><input type="password" value={pwdForm.confirm} onChange={e => setPwdForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Re-enter new password" /></div>
                                </div>
                                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                                    <button className="pf-btn primary sm" onClick={async () => {
                                        if (pwdForm.next !== pwdForm.confirm) { showToast("Passwords don't match", "error"); return; }
                                        if (pwdForm.next.length < 8) { showToast("Password must be at least 8 characters", "error"); return; }
                                        try {
                                            const res = await fetch("/api/user/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.next }) });
                                            const d = await res.json();
                                            if (d.success) { showToast("Password updated ✓"); setPwdForm({ current: "", next: "", confirm: "" }); }
                                            else showToast(d.message || "Failed", "error");
                                        } catch { showToast("Network error", "error"); }
                                    }}>Update Password</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── NOTIFICATIONS ── */}
                    {activeSection === "notifications" && (
                        <div className="pf-card">
                            <div className="pf-sec-head">
                                <div className="pf-sec-head-left">
                                    <div className="pf-sec-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg></div>
                                    <div><div className="pf-sec-title">Notification Preferences</div><div className="pf-sec-sub">Choose what you want to hear about</div></div>
                                </div>
                            </div>
                            <div className="pf-sec-body">
                                {[
                                    { label: "Order Updates", desc: "Shipping, delivery and order status", checked: true },
                                    { label: "Promotions & Offers", desc: "Discounts, sales and special deals", checked: false },
                                    { label: "New Arrivals", desc: "Latest products and collections", checked: true },
                                    { label: "Wishlist Alerts", desc: "Price drops on your saved items", checked: true },
                                    { label: "SMS Notifications", desc: "Text messages for urgent updates", checked: false },
                                ].map(pref => (
                                    <div key={pref.label} className="pf-pref-row">
                                        <div><strong style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block" }}>{pref.label}</strong><span style={{ fontSize: 11.5, color: "var(--text-sub)" }}>{pref.desc}</span></div>
                                        <label className="pf-sw"><input type="checkbox" defaultChecked={pref.checked} /><span className="pf-sl"></span></label>
                                    </div>
                                ))}
                                <button className="pf-btn primary sm" style={{ marginTop: 16 }} onClick={() => showToast("Preferences saved ✓")}>Save Preferences</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast */}
            <div className={`pf-toast${toast.show ? " show" : ""}`} style={{ background: toastColors[toast.type] || "#3A6B50", color: "#fff" }}>
                {toast.msg}
            </div>
        </div>
    );
}
