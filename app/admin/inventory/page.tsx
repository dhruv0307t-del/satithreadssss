"use client";

import { useEffect, useState } from "react";
import {
    Search,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Edit3,
    Save,
    X,
    Plus,
    Minus,
    Package,
    LayoutDashboard,
    ShoppingCart
} from "lucide-react";

export default function InventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    // For Editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?limit=100`);
            const data = await res.json();
            setProducts(data.products || []);

            // Extract unique categories
            const uniqueCats: string[] = Array.from(new Set(data.products?.map((p: any) => p.category) || []));
            setCategories(uniqueCats as string[]);
        } catch (err) {
            console.error("Load products error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = products.filter((p) => {
        const name = p.name || "";
        const pCategory = p.category || "";
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
            pCategory.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "" || p.category === category;
        const matchesLowStock = !filterLowStock || p.quantity < 10;
        return matchesSearch && matchesCategory && matchesLowStock;
    });

    const getStockStatus = (qty: number) => {
        if (qty <= 0) return { label: "Out of Stock", class: "out-of-stock", icon: <XCircle size={14} /> };
        if (qty < 10) return { label: "Low Stock", class: "low-stock", icon: <AlertTriangle size={14} /> };
        return { label: "In Stock", class: "in-stock", icon: <CheckCircle size={14} /> };
    };

    const handleEditClick = (product: any) => {
        setEditingId(product._id);
        setEditData({ ...product });
    };

    const handleSizeStockChange = (sizeIndex: number, newStock: number) => {
        const updatedSizes = [...editData.sizes];
        updatedSizes[sizeIndex].stock = Math.max(0, newStock);

        // Recalculate total quantity
        const newTotal = updatedSizes.reduce((sum, s) => sum + s.stock, 0);
        setEditData({ ...editData, sizes: updatedSizes, quantity: newTotal });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/products/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quantity: editData.quantity,
                    sizes: editData.sizes
                })
            });

            if (res.ok) {
                setProducts(prev => prev.map(p => p._id === editingId ? { ...p, quantity: editData.quantity, sizes: editData.sizes } : p));
                setEditingId(null);
                setEditData(null);
            }
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-main text-black">
            <div className="w-full space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold">Inventory Management</h1>
                        <p className="text-black/60">Monitor and update product stock levels</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setFilterLowStock(!filterLowStock)}
                            className={`px-6 py-3 rounded-xl border transition-all flex items-center gap-2 font-medium ${filterLowStock ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-gray-200 text-gray-700 hover:border-black'}`}
                        >
                            <AlertTriangle size={18} />
                            {filterLowStock ? "Showing Low Stock" : "Filter Low Stock"}
                        </button>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            placeholder="Search by name or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-none bg-gray-50 focus:ring-2 focus:ring-black transition-all"
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-3 rounded-xl border-none bg-gray-50 focus:ring-2 focus:ring-black cursor-pointer min-w-[180px]"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* TABLE CARD */}
                <div className="admin-card border border-gray-100">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="w-16">Image</th>
                                <th>Product Details</th>
                                <th>Category</th>
                                <th>Total Stock</th>
                                <th>Status</th>
                                <th className="text-right">Quick Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="p-8">
                                            <div className="skeleton h-12 w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Package size={48} strokeWidth={1} />
                                            <p>No products found matching filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((p) => {
                                    const status = getStockStatus(p.quantity);
                                    return (
                                        <tr key={p._id}>
                                            <td>
                                                <img
                                                    src={p.mainImage}
                                                    alt={p.name}
                                                    className="admin-product-img"
                                                />
                                            </td>
                                            <td>
                                                <div className="font-semibold">{p.name}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider">{p.subCategory}</div>
                                            </td>
                                            <td className="text-sm font-medium">{p.category}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold">{p.quantity}</span>
                                                    <span className="text-xs text-gray-400 uppercase">units</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`stock-status ${status.class} flex items-center gap-1.5`}>
                                                    {status.icon}
                                                    {status.label}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => handleEditClick(p)}
                                                    className="inventory-edit-btn inline-flex items-center gap-2 hover:bg-black hover:text-white transition-all"
                                                >
                                                    <Edit3 size={14} />
                                                    Manage Stock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editingId && editData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !saving && setEditingId(null)} />

                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold">Update Inventory</h3>
                                <p className="text-sm text-gray-500">{editData.name}</p>
                            </div>
                            <button
                                onClick={() => setEditingId(null)}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                disabled={saving}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto max-h-[60vh] space-y-8">
                            {/* Total Summary */}
                            <div className="bg-black text-white p-6 rounded-2xl flex justify-between items-center">
                                <div>
                                    <div className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Total Quantity</div>
                                    <div className="text-3xl font-bold">{editData.quantity}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`stock-status ${getStockStatus(editData.quantity).class} ring-2 ring-white/10`}>
                                        {getStockStatus(editData.quantity).label}
                                    </div>
                                </div>
                            </div>

                            {/* Sizes Grid */}
                            <div className="space-y-4">
                                <h4 className="font-bold flex items-center gap-2 uppercase text-xs tracking-widest text-gray-500">
                                    <LayoutDashboard size={14} />
                                    Stock by Size
                                </h4>

                                <div className="grid grid-cols-1 gap-3">
                                    {editData.sizes?.map((sizeObj: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="font-bold text-lg w-16">{sizeObj.size}</div>

                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleSizeStockChange(idx, sizeObj.stock - 1)}
                                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-black transition-all"
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <input
                                                    type="number"
                                                    value={sizeObj.stock}
                                                    onChange={(e) => handleSizeStockChange(idx, parseInt(e.target.value) || 0)}
                                                    className="w-16 text-center font-bold text-lg bg-transparent border-none focus:ring-0 p-0"
                                                />

                                                <button
                                                    onClick={() => handleSizeStockChange(idx, sizeObj.stock + 1)}
                                                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-black transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {(!editData.sizes || editData.sizes.length === 0) && (
                                        <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-500 italic text-center">
                                            No specific sizes defined for this product.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={() => setEditingId(null)}
                                className="flex-1 py-4 font-bold text-gray-500 hover:text-black transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-[2] py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
