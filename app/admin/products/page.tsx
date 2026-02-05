"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const limit = 8;

  const loadProducts = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/products?search=${search}&page=${page}&limit=${limit}&sort=${sort}`
    );
    const data = await res.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [search, page, sort]);

  /* =============================
     BULK SELECT
  ============================== */
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(
      selected.length === products.length
        ? []
        : products.map((p) => p._id)
    );
  };

  /* =============================
     DELETE
  ============================== */
  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} products?`)) return;

    await Promise.all(
      selected.map((id) =>
        fetch(`/api/products/${id}`, { method: "DELETE" })
      )
    );

    setSelected([]);
    loadProducts();
  };

  return (
    <div className="admin-main text-black">
      <div className="w-full space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold">All Products</h1>
            <p className="text-black/60">Premium product management</p>
          </div>

          <div className="flex gap-4">
            <Link href="/admin/products/upload">
              <button className="px-6 py-3 rounded-xl bg-[#3b1f23] text-white hover:bg-black transition-all shadow-md">
                Bulk Upload
              </button>
            </Link>

            {selected.length > 0 && (
              <button
                onClick={bulkDelete}
                className="px-6 py-3 rounded-xl bg-red-600 text-white shadow-md"
              >
                Delete Selected ({selected.length})
              </button>
            )}
          </div>
        </div>

        {/* SEARCH + SORT */}
        <div className="flex gap-6 items-center">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="admin-search"
          />

          <select
            onChange={(e) => setSort(e.target.value)}
            className="admin-input max-w-xs"
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={selectAll}
                    checked={selected.length === products?.length && (products?.length ?? 0) > 0}
                    className="bulk-checkbox"
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-6">
                      <div className="skeleton h-12 w-full"></div>
                    </td>
                  </tr>
                ))}

              {!loading &&
                products?.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(p._id)}
                        onChange={() => toggleSelect(p._id)}
                        className="bulk-checkbox"
                      />
                    </td>

                    <td className="flex items-center gap-4">
                      <img
                        src={p.mainImage}
                        className="admin-product-img cursor-pointer"
                        onMouseEnter={() => setPreview(p.mainImage)}
                        onMouseLeave={() => setPreview(null)}
                      />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-black/50">{p.subCategory}</p>
                      </div>
                    </td>

                    <td>{p.category}</td>
                    <td>₹{p.priceNew}</td>
                    <td>{p.quantity}</td>

                    <td className="text-right space-x-6">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="admin-action edit"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="admin-action delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && products?.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-black/50">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="admin-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="admin-page-btn"
          >
            Prev
          </button>

          <span className="admin-page-btn active">{page}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="admin-page-btn"
          >
            Next
          </button>
        </div>
      </div>

      {/* IMAGE PREVIEW */}
      {preview && (
        <div className="preview-overlay" onClick={() => setPreview(null)}>
          <img src={preview} className="preview-img" />
        </div>
      )}
    </div>
  );
}
