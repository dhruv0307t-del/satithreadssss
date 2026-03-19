"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, Home, Briefcase, CheckCircle2, X, Loader2 } from "lucide-react";

export default function AddressesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [newAddress, setNewAddress] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false
    });

    const INDIAN_STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
            return;
        }

        if (status === "authenticated") {
            fetchAddresses();
        }
    }, [status]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/user/address");
            const data = await res.json();
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (err) {
            console.error("Failed to fetch addresses");
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/user/address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAddress)
            });
            const data = await res.json();

            if (data.success) {
                setAddresses(data.addresses);
                setShowAddForm(false);
                setNewAddress({
                    name: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    pincode: "",
                    isDefault: false
                });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to save address");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const res = await fetch(`/api/user/address?id=${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (err) {
            console.error("Failed to delete address");
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#F2EFE0] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#3A6B50]" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2EFE0] py-12 px-4 sm:px-6 lg:px-8 font-['DM_Sans']">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-[#1A1A14] tracking-tight">Saved Addresses</h1>
                        <p className="text-[#6B7060] mt-2">Manage your delivery locations for faster checkout</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-[#3A6B50] text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-[#2d523d] transition-all shadow-lg hover:translate-y-[-2px]"
                    >
                        <Plus size={18} /> Add New Address
                    </button>
                </div>

                {/* Address List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length === 0 ? (
                        <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-dashed border-[#C0C4B8]">
                            <div className="w-16 h-16 bg-[#F2EFE0] rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin size={24} className="text-[#3A6B50]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1A1A14]">No saved addresses yet</h3>
                            <p className="text-[#6B7060] mt-2">Add your first address to make checkout easier.</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="mt-6 text-[#3A6B50] font-bold underline"
                            >
                                Add Your First Address
                            </button>
                        </div>
                    ) : (
                        addresses.map((addr: any) => (
                            <div
                                key={addr._id}
                                className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm ${addr.isDefault ? "border-[#3A6B50]" : "border-transparent"}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-xl ${addr.isDefault ? "bg-[#3A6B50] text-white" : "bg-[#F2EFE0] text-[#3A6B50]"}`}>
                                            <Home size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1A1A14]">{addr.name}</h4>
                                            <p className="text-xs text-[#6B7060]">{addr.phone}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAddress(addr._id)}
                                        className="text-[#D47A72] hover:text-[#C0392B] p-2 hover:bg-[#FDECEA] rounded-full transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <p className="text-[#1A1A14] text-sm leading-relaxed mb-4">
                                    {addr.address}<br />
                                    {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                {addr.isDefault && (
                                    <div className="flex items-center gap-1.5 text-[#3A6B50] text-xs font-bold uppercase tracking-wider">
                                        <CheckCircle2 size={14} /> Default Address
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Add Address Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
                        <div className="relative bg-[#F2EFE0] rounded-[32px] w-full max-w-xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-all"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-[#1A1A14] mb-6">Add New Address</h2>

                            <form onSubmit={handleAddAddress} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#7A8070] uppercase ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            className="w-full bg-white border border-[#C0C4B8] rounded-2xl px-5 py-3.5 outline-none focus:border-[#3A6B50] transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#7A8070] uppercase ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            className="w-full bg-white border border-[#C0C4B8] rounded-2xl px-5 py-3.5 outline-none focus:border-[#3A6B50] transition-all"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#7A8070] uppercase ml-1">Street Address</label>
                                    <textarea
                                        required
                                        value={newAddress.address}
                                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                        className="w-full bg-white border border-[#C0C4B8] rounded-2xl px-5 py-3.5 outline-none focus:border-[#3A6B50] transition-all min-h-[100px]"
                                        placeholder="Flat, House no., Building, Company, Apartment"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#7A8070] uppercase ml-1">City</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.city}
                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                            className="w-full bg-white border border-[#C0C4B8] rounded-2xl px-5 py-3.5 outline-none focus:border-[#3A6B50] transition-all"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#7A8070] uppercase ml-1">State</label>
                                        <select
                                            required
                                            value={newAddress.state}
                                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                            className="w-full bg-white border border-[#C0C4B8] rounded-2xl px-5 py-3.5 outline-none focus:border-[#3A6B50] transition-all appearance-none"
                                        >
                                            <option value="">Select State</option>
                                            {INDIAN_STATES.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#7A8070] uppercase ml-1">Pincode</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAddress.pincode}
                                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                            className="w-full bg-white border border-[#C0C4B8] rounded-2xl px-5 py-3.5 outline-none focus:border-[#3A6B50] transition-all"
                                            placeholder="400001"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            type="checkbox"
                                            id="isDefault"
                                            checked={newAddress.isDefault}
                                            onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                            className="w-5 h-5 accent-[#3A6B50]"
                                        />
                                        <label htmlFor="isDefault" className="text-sm font-semibold text-[#1A1A14] cursor-pointer">Set as default address</label>
                                    </div>
                                </div>

                                {error && <p className="text-[#C0392B] text-sm text-center">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#3A6B50] text-white py-4 rounded-2xl font-bold text-lg mt-4 flex items-center justify-center gap-2 hover:bg-[#2d523d] transition-all shadow-xl disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : "Save Address"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
