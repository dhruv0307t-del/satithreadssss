"use client";

import { useState } from "react";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
const CATEGORIES = [
  "Kurta Sets",
  "Dupatta Sets",
  "Skirts",
  "Cord Sets",
  "Farshi Salwar Sets",
  "Tops",
  "Short Kurtis",
  "Unstitched Suits",
];

export default function AddProduct() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    fabric: "",
    category: "",
    subCategory: "",
    categoryTheme: "",
    sizes: [] as { size: string; stock: number }[],
    colors: "",
    priceOld: "",
    priceNew: "",
    discountPercent: "",
    couponAllowed: false,
    mainImage: "",
    gridImages: [] as string[],
    video: "",
    isFeatured: false,
    isBestSeller: false,
    isFestive: false,
    isActive: true,
  });

  const toggleSize = (size: string) => {
    setForm((prev) => {
      const exists = prev.sizes.find((s) => s.size === size);
      if (exists) {
        return {
          ...prev,
          sizes: prev.sizes.filter((s) => s.size !== size),
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
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s) =>
        s.size === size ? { ...s, stock } : s
      ),
    }));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.url;
  };

  const submit = async () => {
    if (!form.name || !form.priceNew || !form.mainImage) {
      alert("Product name, price & main image required");
      return;
    }

    setLoading(true);

    // Calculate total quantity from sizes
    const totalQuantity = form.sizes.reduce((acc, curr) => acc + curr.stock, 0);

    const colorsArray = form.colors ? form.colors.split(",").map((c) => c.trim()) : [];

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: totalQuantity,
        colors: colorsArray,
        gridImages: form.gridImages,
      }),
    });

    setLoading(false);
    alert("✅ Product added");
    // Optionally reset form or redirect
    setForm({
      name: "",
      description: "",
      fabric: "",
      category: "",
      subCategory: "",
      categoryTheme: "",
      sizes: [],
      colors: "",
      priceOld: "",
      priceNew: "",
      discountPercent: "",
      couponAllowed: false,
      mainImage: "",
      gridImages: [],
      video: "",
      isFeatured: false,
      isBestSeller: false,
      isFestive: false,
      isActive: true,
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#efe9df] px-14 py-12">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-gray-900">
          Add New Product
        </h1>
        <p className="text-gray-600 mt-1">
          Create a new product for your store
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT FORM */}
        <div className="lg:col-span-2 space-y-10">
          {/* BASIC */}
          <Section title="Basic Details">
            <Input
              label="Product Title"
              value={form.name}
              onChange={(v: string) => setForm({ ...form, name: v })}
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(v: string) => setForm({ ...form, description: v })}
            />
            <Input
              label="Fabric"
              value={form.fabric}
              onChange={(v: string) => setForm({ ...form, fabric: v })}
            />
          </Section>

          {/* CATEGORY */}
          <Section title="Category">
            <CategorySelect
              value={form.category}
              onChange={(v: string) => setForm({ ...form, category: v })}
            />

            <Input
              label="Sub Category"
              value={form.subCategory}
              onChange={(v: string) => setForm({ ...form, subCategory: v })}
            />

            <Input
              label="Theme / Model"
              value={form.categoryTheme}
              onChange={(v: string) =>
                setForm({ ...form, categoryTheme: v })
              }
            />
          </Section>


          {/* VARIANTS */}
          <Section title="Variants & Stock">
            <div>
              <p className="label mb-2">Select Sizes Available</p>
              <div className="flex gap-3 flex-wrap mb-4">
                {SIZE_OPTIONS.map((s) => {
                  const isSelected = form.sizes.some((size) => size.size === s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`px-5 py-2 rounded-lg border transition-all ${isSelected
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-300 hover:border-black"
                        }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {form.sizes.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                  <p className="text-sm font-semibold mb-3">Set Stock per Size</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {form.sizes.map((s) => (
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
            </div>

            <Input
              label="Colors (comma separated)"
              value={form.colors}
              onChange={(v: string) => setForm({ ...form, colors: v })}
            />
          </Section>

          {/* PRICING */}
          <Section title="Pricing">
            <Input
              label="Old Price"
              value={form.priceOld}
              onChange={(v: string) => setForm({ ...form, priceOld: v })}
            />
            <Input
              label="New Price"
              value={form.priceNew}
              onChange={(v: string) => setForm({ ...form, priceNew: v })}
            />
            <Input
              label="Discount %"
              value={form.discountPercent}
              onChange={(v: string) =>
                setForm({ ...form, discountPercent: v })
              }
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.couponAllowed}
                onChange={(e) =>
                  setForm({
                    ...form,
                    couponAllowed: e.target.checked,
                  })
                }
              />
              Coupon Allowed
            </label>
          </Section>
        </div>

        {/* RIGHT MEDIA */}
        <div className="space-y-10">
          <Section title="Product Media">
            {/* MAIN IMAGE */}
            <div className="space-y-4">
              <label className="font-semibold text-black">
                Main Product Image
              </label>

              <div
                className="admin-image-drop cursor-pointer"
                onClick={() =>
                  document
                    .getElementById("mainImageInput")
                    ?.click()
                }
              >
                {form.mainImage ? (
                  <img
                    src={form.mainImage}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <span className="text-4xl text-black/40">+</span>
                )}
              </div>

              <input
                id="mainImageInput"
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  if (!e.target.files?.[0]) return;
                  setLoading(true);
                  const url = await uploadImage(
                    e.target.files[0]
                  );
                  setForm({ ...form, mainImage: url });
                  setLoading(false);
                }}
              />
            </div>

            {/* GRID IMAGES */}
            <div className="space-y-4">
              <label className="font-semibold text-black">
                Grid Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files) return;
                  setLoading(true);

                  const uploads = await Promise.all(
                    Array.from(e.target.files).map(uploadImage)
                  );

                  setForm({
                    ...form,
                    gridImages: [
                      ...(form.gridImages || []),
                      ...uploads,
                    ],
                  });

                  setLoading(false);
                }}
              />

              {form.gridImages?.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {form.gridImages.map(
                    (img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        className="h-24 w-full object-cover rounded-lg border"
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* VIDEO */}
            <Input
              label="Video URL"
              value={form.video}
              onChange={(v: string) => setForm({ ...form, video: v })}
            />
          </Section>

          {/* STATUS */}
          <Section title="Status">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isFeatured: e.target.checked,
                  })
                }
              />
              Featured Product
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isBestSeller}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isBestSeller: e.target.checked,
                  })
                }
              />
              Best Seller
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isFestive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isFestive: e.target.checked,
                  })
                }
              />
              Festive Collection
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: e.target.checked,
                  })
                }
              />
              Active Product
            </label>
          </Section>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-6 mt-14">
        <button className="px-8 py-3 border rounded-lg">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="px-10 py-3 bg-black text-white rounded-lg"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function Section({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl p-8 space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <p className="label">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div>
      <p className="label">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full px-4 py-3 rounded-lg border"
      />
    </div>
  );
}
function CategorySelect({ value, onChange }: any) {
  return (
    <div>
      <p className="label">Category</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border bg-white"
      >
        <option value="">Select Category</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
