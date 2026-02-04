"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

export default function EditProduct() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>(null);

  /* =============================
     LOAD PRODUCT
  ============================== */
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();

        // Handle legacy sizes (string[]) vs new sizes ({size, stock}[])
        const sizes = Array.isArray(data.sizes)
          ? data.sizes.map((s: any) =>
            typeof s === "string" ? { size: s, stock: 0 } : s
          )
          : [];

        setForm({
          ...data,
          sizes,
          colors: data.colors?.join(", ") || "",
          gridImages: data.gridImages?.join(", ") || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      }
    };

    loadProduct();
  }, [id]);

  if (!form) {
    return <div className="admin-main text-black">Loading...</div>;
  }

  /* =============================
     SIZE TOGGLE
  ============================== */
  const toggleSize = (size: string) => {
    setForm((prev: any) => {
      const exists = prev.sizes.find((s: any) => s.size === size);
      if (exists) {
        return {
          ...prev,
          sizes: prev.sizes.filter((s: any) => s.size !== size),
        };
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, { size, stock: 0 }],
        };
      }
    });
  };

  const updateSizeStock = (size: string, stock: number) => {
    setForm((prev: any) => ({
      ...prev,
      sizes: prev.sizes.map((s: any) =>
        s.size === size ? { ...s, stock } : s
      ),
    }));
  };

  /* =============================
     UPDATE PRODUCT
  ============================== */
  const update = async () => {
    try {
      setLoading(true);

      // Calculate total quantity from sizes
      const totalQuantity = form.sizes.reduce((acc: number, curr: any) => acc + curr.stock, 0);

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: totalQuantity,
          colors: form.colors
            ? form.colors.split(",").map((c: string) => c.trim())
            : [],
          gridImages: form.gridImages
            ? form.gridImages.split(",").map((i: string) => i.trim())
            : [],
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Product updated successfully");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     DELETE PRODUCT
  ============================== */
  const deleteProduct = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Product deleted");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="admin-main">
      <div className="w-full space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-bold text-black">Edit Product</h1>
          <p className="text-black/70">Update product details</p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl p-10 space-y-14">

          {/* BASIC */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Basic Details</h2>

            <input
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Product Name"
              className="admin-input"
            />

            <textarea
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Description"
              className="admin-input min-h-[140px]"
            />

            <input
              value={form.fabric || ""}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })}
              placeholder="Fabric"
              className="admin-input"
            />
          </section>

          {/* CATEGORY */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Category</h2>

            <input
              value={form.category || ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Category"
              className="admin-input"
            />

            <input
              value={form.subCategory || ""}
              onChange={(e) =>
                setForm({ ...form, subCategory: e.target.value })
              }
              placeholder="Sub Category"
              className="admin-input"
            />

            <input
              value={form.categoryTheme || ""}
              onChange={(e) =>
                setForm({ ...form, categoryTheme: e.target.value })
              }
              placeholder="Theme / Model"
              className="admin-input"
            />
          </section>

          {/* VARIANTS */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Variants & Stock</h2>

            <div className="flex flex-wrap gap-3 mb-4">
              {SIZE_OPTIONS.map((size) => {
                const isSelected = form.sizes.some((s: any) => s.size === size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-5 py-2 rounded-lg border transition
                      ${isSelected
                        ? "bg-black text-white"
                        : "bg-white text-black"
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {form.sizes.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
                <p className="text-sm font-semibold mb-3">Set Stock per Size</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {form.sizes.map((s: any) => (
                    <div key={s.size}>
                      <label className="text-xs text-gray-500 mb-1 block">Size {s.size}</label>
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => updateSizeStock(s.size, Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              value={form.colors || ""}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
              placeholder="Colors (comma separated)"
              className="admin-input"
            />
          </section>

          {/* PRICING */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Pricing</h2>

            <input
              value={form.priceOld || ""}
              onChange={(e) => setForm({ ...form, priceOld: e.target.value })}
              placeholder="Old Price"
              className="admin-input"
            />

            <input
              value={form.priceNew || ""}
              onChange={(e) => setForm({ ...form, priceNew: e.target.value })}
              placeholder="New Price"
              className="admin-input"
            />

            <input
              value={form.discountPercent || ""}
              onChange={(e) =>
                setForm({ ...form, discountPercent: e.target.value })
              }
              placeholder="Discount %"
              className="admin-input"
            />
          </section>

          {/* MEDIA */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Media</h2>

            <input
              value={form.mainImage || ""}
              onChange={(e) =>
                setForm({ ...form, mainImage: e.target.value })
              }
              placeholder="Main Image URL"
              className="admin-input"
            />

            <input
              value={form.gridImages || ""}
              onChange={(e) =>
                setForm({ ...form, gridImages: e.target.value })
              }
              placeholder="Grid Images (comma separated)"
              className="admin-input"
            />

            <input
              value={form.video || ""}
              onChange={(e) => setForm({ ...form, video: e.target.value })}
              placeholder="Video URL"
              className="admin-input"
            />
          </section>

          {/* STATUS */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Status</h2>

            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured || false}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-lg">Featured Product</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBestSeller || false}
                  onChange={(e) =>
                    setForm({ ...form, isBestSeller: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-lg">Best Seller</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFestive || false}
                  onChange={(e) =>
                    setForm({ ...form, isFestive: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-lg">Festive Collection</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive ?? true}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-lg">Active Product</span>
              </label>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex justify-between items-center pt-10 border-t">

            {/* DELETE */}
            <button
              onClick={deleteProduct}
              className="px-10 py-3 rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              Delete Product
            </button>

            {/* SAVE */}
            <div className="flex gap-6">
              <button
                onClick={() => router.back()}
                className="px-10 py-3 border rounded-xl text-black"
              >
                Cancel
              </button>

              <button
                onClick={update}
                disabled={loading}
                className="px-12 py-3 bg-black text-white rounded-xl disabled:opacity-60"
              >
                {loading ? "Saving..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
