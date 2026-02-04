"use client";

import { useEffect, useState } from "react";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        code: "",
        discount: "",
        type: "flat",
        minCartValue: "0",
        imageUrl: "",
        isActive: true,
    });

    const fetchCoupons = () => {
        fetch("/api/coupons")
            .then((res) => res.json())
            .then(setCoupons);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

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

        setLoading(true);
        const res = await fetch("/api/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            setForm({
                code: "",
                discount: "",
                type: "flat",
                minCartValue: "0",
                imageUrl: "",
                isActive: true,
            });
            fetchCoupons();
        } else {
            alert("Failed to create coupon");
        }
        setLoading(false);
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/coupons/${id}`, { method: "DELETE" });
        fetchCoupons();
    };

    return (
        <div className="admin-main text-black">
            <h1 className="admin-title mb-8">Manage Coupons</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ADD COUPON FORM */}
                <div className="bg-white p-8 rounded-2xl h-fit">
                    <h2 className="text-xl font-bold mb-6">Create Coupon</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Coupon Code</label>
                            <input
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                className="admin-input uppercase"
                                placeholder="Ex: WELCOME50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Discount</label>
                                <input
                                    type="number"
                                    value={form.discount}
                                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                    className="admin-input"
                                    placeholder="Amount/Percent"
                                />
                            </div>
                            <div>
                                <label className="label">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="admin-input"
                                >
                                    <option value="flat">Flat ₹</option>
                                    <option value="percent">% Off</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">Min Cart Value</label>
                            <input
                                type="number"
                                value={form.minCartValue}
                                onChange={(e) => setForm({ ...form, minCartValue: e.target.value })}
                                className="admin-input"
                            />
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div>
                            <label className="label">Popup Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        setLoading(true);
                                        const url = await uploadImage(e.target.files[0]);
                                        setForm({ ...form, imageUrl: url });
                                        setLoading(false);
                                    }
                                }}
                                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200"
                            />
                            {form.imageUrl && (
                                <img src={form.imageUrl} className="mt-4 w-full h-32 object-cover rounded-lg" />
                            )}
                        </div>

                        <button
                            onClick={submit}
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-lg font-bold"
                        >
                            {loading ? "Creating..." : "Create Coupon"}
                        </button>
                    </div>
                </div>

                {/* COUPON LIST */}
                <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">Code</th>
                                <th className="text-left">Discount</th>
                                <th className="text-left">Min Order</th>
                                <th className="text-left">Image</th>
                                <th className="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((c) => (
                                <tr key={c._id} className="border-t">
                                    <td className="p-4 font-bold">{c.code}</td>
                                    <td>
                                        {c.type === "flat" ? "₹" : ""}
                                        {c.discount}
                                        {c.type === "percent" ? "%" : ""}
                                    </td>
                                    <td>₹{c.minCartValue}</td>
                                    <td>
                                        {c.imageUrl && (
                                            <img src={c.imageUrl} className="w-10 h-10 object-cover rounded" />
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => deleteCoupon(c._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No coupons found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
