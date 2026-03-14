"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Category {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    headerImage: string;
}

const GLOBAL_CSS = `
:root {
  --bg: #F2EFE0;
  --card: #FFFFFF;
  --green: #3A6B50;
  --green-light: #5DA87A;
  --green-pale: #EAF4EE;
  --label: #7A8070;
  --text: #1A1A14;
  --text-sub: #6B7060;
  --border: rgba(58,107,80,0.12);
  --shadow: 0 2px 16px rgba(40,60,40,0.07), 0 1px 3px rgba(40,60,40,0.04);
  --shadow-lg: 0 12px 40px rgba(40,60,40,0.13), 0 4px 12px rgba(40,60,40,0.07);
  --red: #C0392B;
  --red-soft: #FDECEA;
  --amber: #B87620;
  --amber-soft: #FEF3E2;
  --blue: #2C6E8A;
  --blue-soft: #E8F4FA;
  --radius: 20px;
  --radius-sm: 12px;
}

.ac-page { max-width: 1100px; margin: 0 auto; padding: 40px 32px 80px; font-family: 'DM Sans', sans-serif; color: var(--text); }

/* Header */
.ac-header { margin-bottom: 28px; }
.ac-header-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.ac-header-left { display: flex; align-items: center; gap: 14px; }
.ac-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--green); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(58,107,80,0.3); flex-shrink: 0; }
.ac-header h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1; }
.ac-header p { font-size: 13px; color: var(--text-sub); margin-top: 3px; }

/* Grid Config */
.ac-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
@media (max-width: 900px) { .ac-grid { grid-template-columns: 1fr; } }

/* Cards */
.ac-card { background: var(--card); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.9); margin-bottom: 16px; animation: fadeUp 0.3s ease both; }

.ac-sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
.ac-sec-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 17px; }
.ac-sec-title { font-size: 17px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
.ac-sec-sub { font-size: 12px; color: var(--text-sub); margin-top: 2px; }

/* Form Fields */
.ac-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.ac-field label { font-size: 12px; font-weight: 600; color: var(--text); }
.ac-field input { width: 100%; padding: 12px 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: #FAFAF7; font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--text); outline: none; transition: all 0.17s; }
.ac-field input:focus { border-color: var(--green); background: #fff; box-shadow: 0 0 0 3px rgba(58,107,80,0.08); }
.ac-field input::placeholder { color: #B0B5A8; }

/* File Uploader */
.ac-upload-zone { border: 2px dashed rgba(58,107,80,0.15); border-radius: var(--radius-sm); padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(250,250,247,0.5); position: relative; overflow: hidden; }
.ac-upload-zone:hover { border-color: var(--green); background: rgba(58,107,80,0.03); }
.ac-upload-icon { width: 32px; height: 32px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--green); box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
.ac-upload-text { font-size: 12px; color: var(--text-sub); font-weight: 500; }
.ac-upload-preview { width: 100%; height: 100px; object-fit: contain; border-radius: 8px; margin-bottom: 10px; }
.ac-upload-preview.banner { height: 60px; object-fit: cover; }
.ac-remove-img { position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.5); color: #fff; border: none; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; opacity: 0; transition: opacity 0.2s; }
.ac-upload-zone:hover .ac-remove-img { opacity: 1; }
.ac-upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }

/* Buttons */
.ac-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 11px 22px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.17s; }
.ac-btn-primary { background: var(--green); color: #fff; box-shadow: 0 2px 10px rgba(58,107,80,0.25); }
.ac-btn-primary:hover:not(:disabled) { background: #2e5640; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(58,107,80,0.3); }
.ac-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.ac-btn-ghost { background: var(--card); color: var(--text-sub); border: 1.5px solid var(--border); }
.ac-btn-ghost:hover { border-color: var(--green); color: var(--green); }
.ac-btn-full { width: 100%; margin-top: 8px; }

/* Table */
.ac-table { width: 100%; border-collapse: collapse; }
.ac-table th { padding: 11px 14px; font-size: 10px; font-weight: 600; letter-spacing: 1.3px; text-transform: uppercase; color: var(--label); text-align: left; background: rgba(242,239,224,0.5); border-bottom: 1px solid var(--border); }
.ac-table th:last-child { text-align: right; }
.ac-table td { padding: 14px; font-size: 13px; vertical-align: middle; border-bottom: 1px solid rgba(58,107,80,0.05); }
.ac-table td:last-child { text-align: right; }
.ac-table tr:hover { background: rgba(58,107,80,0.025); }

.ac-cat-cell { display: flex; align-items: center; gap: 12px; }
.ac-cat-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; background: var(--green-pale); border: 1px solid var(--border); }
.ac-cat-title { font-size: 14px; font-weight: 600; color: var(--text); }
.ac-cat-slug { font-size: 12px; color: var(--text-sub); font-family: 'DM Mono', monospace; margin-top: 2px; }

/* Row Actions */
.ac-row-actions { display: flex; gap: 5px; justify-content: flex-end; opacity: 0; transition: opacity 0.13s; }
.ac-table tr:hover .ac-row-actions { opacity: 1; }
.ac-row-btn { width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; color: var(--text-sub); }
.ac-row-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-pale); }
.ac-row-btn.danger:hover { border-color: var(--red); color: var(--red); background: var(--red-soft); }

@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
`;

export default function AdminCategoriesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: "", slug: "", thumbnail: "", headerImage: "" });
    const thumbRef = useRef<HTMLInputElement>(null);
    const headerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login');
        else if (status === 'authenticated') {
            if (!['admin', 'master_admin'].includes(session?.user?.role as string)) {
                router.push('/admin');
            } else {
                fetchCategories();
            }
        }
    }, [status, session, router]);

    const fetchCategories = async () => {
        try {
            setFetching(true);
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) setCategories(data.categories);
        } catch (e) { console.error("Failed to fetch categories"); }
        finally { setFetching(false); }
    };

    const showToast = (msg: string, type: 'success' | 'error') => {
        const t = document.createElement('div');
        t.style.cssText = `position:fixed;bottom:30px;right:24px;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.15);font-family:DM Sans,sans-serif;background:${type === 'success' ? 'var(--green)' : 'var(--red)'};color:#fff;transition:all 0.3s`;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setForm({ ...form, title, slug });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'headerImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload-image", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                setForm(prev => ({ ...prev, [field]: data.url }));
                showToast("Image uploaded successfully", "success");
            } else {
                showToast("Failed to upload image", "error");
            }
        } catch { showToast("Error uploading image", "error"); }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.slug) {
            showToast("Title and Slug are required", "error"); return;
        }

        setLoading(true);
        try {
            const isEditing = !!editingId;
            const url = isEditing ? `/api/categories/${editingId}` : `/api/categories`;
            const method = isEditing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method, headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();

            if (data.success) {
                showToast(`Category ${isEditing ? 'updated' : 'created'} successfully!`, "success");
                setForm({ title: "", slug: "", thumbnail: "", headerImage: "" });
                setEditingId(null);
                fetchCategories();
            } else {
                showToast(data.error || "Failed to save category", "error");
            }
        } catch { showToast("Error saving category", "error"); }
        setLoading(false);
    };

    const handleEdit = (c: Category) => {
        setEditingId(c._id);
        setForm({ title: c.title, slug: c.slug, thumbnail: c.thumbnail || '', headerImage: c.headerImage || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showToast("Category deleted", "success");
                fetchCategories();
            } else showToast("Failed to delete", "error");
        } catch { showToast("Error deleting", "error"); }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({ title: "", slug: "", thumbnail: "", headerImage: "" });
    };

    return (
        <div className="ac-page">
            <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

            {/* Header */}
            <div className="ac-header">
                <div className="ac-header-top">
                    <div className="ac-header-left">
                        <div className="ac-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </div>
                        <div>
                            <h1>Categories</h1>
                            <p>Manage product categories, shop carousel thumbnails, and header banners.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ac-grid">
                {/* Left Column - Form */}
                <div>
                    <div className="ac-card" style={{ position: 'sticky', top: '24px' }}>
                        <div className="ac-sec-header" style={{ marginBottom: '16px' }}>
                            <div className="ac-sec-icon" style={{ background: editingId ? 'var(--blue-soft)' : 'var(--green-pale)' }}>
                                {editingId ? '✏️' : '➕'}
                            </div>
                            <div>
                                <div className="ac-sec-title">{editingId ? 'Edit Category' : 'Add New Category'}</div>
                                <div className="ac-sec-sub">{editingId ? 'Update details below' : 'Create a dynamic category'}</div>
                            </div>
                        </div>

                        <div className="ac-field">
                            <label>Category Title *</label>
                            <input type="text" placeholder="e.g. Kurta Sets" value={form.title} onChange={handleTitleChange} />
                        </div>

                        <div className="ac-field">
                            <label>URL Slug *</label>
                            <input type="text" placeholder="kurta-sets" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                        </div>

                        <div className="ac-field">
                            <label>Shop by Category Thumbnail</label>
                            <span style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '-4px', marginBottom: '4px' }}>Shown on Homepage carousel (Portrait 3:4)</span>
                            <div className="ac-upload-zone" onClick={() => !form.thumbnail && thumbRef.current?.click()}>
                                {form.thumbnail ? (
                                    <>
                                        <img src={form.thumbnail} alt="Preview" className="ac-upload-preview" />
                                        <button className="ac-remove-img" onClick={(e) => { e.stopPropagation(); setForm({ ...form, thumbnail: '' }) }}>&times;</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="ac-upload-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg></div>
                                        <div className="ac-upload-text">Upload Thumbnail</div>
                                    </>
                                )}
                                <input type="file" ref={thumbRef} onChange={e => handleImageUpload(e, 'thumbnail')} accept="image/*" />
                            </div>
                        </div>

                        <div className="ac-field">
                            <label>Header Banner Image</label>
                            <span style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '-4px', marginBottom: '4px' }}>Top banner for category page (Landscape 16:9)</span>
                            <div className="ac-upload-zone" onClick={() => !form.headerImage && headerRef.current?.click()}>
                                {form.headerImage ? (
                                    <>
                                        <img src={form.headerImage} alt="Preview" className="ac-upload-preview banner" />
                                        <button className="ac-remove-img" onClick={(e) => { e.stopPropagation(); setForm({ ...form, headerImage: '' }) }}>&times;</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="ac-upload-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg></div>
                                        <div className="ac-upload-text">Upload Header Banner</div>
                                    </>
                                )}
                                <input type="file" ref={headerRef} onChange={e => handleImageUpload(e, 'headerImage')} accept="image/*" />
                            </div>
                        </div>

                        <button className="ac-btn ac-btn-primary ac-btn-full" onClick={handleSubmit} disabled={loading}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                            {loading ? "Saving..." : (editingId ? "Save Changes" : "Create Category")}
                        </button>
                        {editingId && (
                            <button className="ac-btn ac-btn-ghost ac-btn-full" onClick={cancelEdit}>Cancel Edit</button>
                        )}
                    </div>
                </div>

                {/* Right Column - Table */}
                <div className="ac-card">
                    <div className="ac-sec-header">
                        <div className="ac-sec-icon" style={{ background: 'var(--amber-soft)' }}>📋</div>
                        <div>
                            <div className="ac-sec-title">All Categories</div>
                            <div className="ac-sec-sub">Manage existing categories everywhere</div>
                        </div>
                    </div>

                    {fetching ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-sub)' }}>Loading categories...</div>
                    ) : categories.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--label)' }}>No categories found. Create your first one!</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="ac-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Assets</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(c => (
                                        <tr key={c._id}>
                                            <td>
                                                <div className="ac-cat-cell">
                                                    {c.thumbnail ? (
                                                        <img src={c.thumbnail} alt={c.title} className="ac-cat-thumb" />
                                                    ) : (
                                                        <div className="ac-cat-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-light)', fontSize: '10px' }}>No Img</div>
                                                    )}
                                                    <div>
                                                        <div className="ac-cat-title">{c.title}</div>
                                                        <div className="ac-cat-slug">/{c.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: c.thumbnail ? 'var(--green-pale)' : 'rgba(0,0,0,0.05)', color: c.thumbnail ? 'var(--green)' : 'var(--label)' }}>Thumb</span>
                                                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: c.headerImage ? 'var(--blue-soft)' : 'rgba(0,0,0,0.05)', color: c.headerImage ? 'var(--blue)' : 'var(--label)' }}>Header</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="ac-row-actions">
                                                    <button className="ac-row-btn" title="Edit" onClick={() => handleEdit(c)}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button className="ac-row-btn danger" title="Delete" onClick={() => handleDelete(c._id)}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
