"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

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
  --border-focus: #3A6B50;
  --shadow: 0 2px 16px rgba(40,60,40,0.07), 0 1px 3px rgba(40,60,40,0.04);
  --shadow-lg: 0 8px 32px rgba(40,60,40,0.10);
  --red: #C0392B;
  --red-soft: #FDECEA;
  --amber: #B87620;
  --amber-soft: #FEF3E2;
  --radius: 20px;
  --radius-sm: 12px;
  --radius-xs: 8px;
}

/* ── Page ── */
.ap-page { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

/* ── Layout ── */
.ap-layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }

/* ── Sticky Sidebar ── */
.ap-sidebar { position: sticky; top: 0; height: 100vh; padding: 40px 0 40px 0px; display: flex; flex-direction: column; gap: 4px; border-right: 1px solid var(--border); background: var(--card); }
.ap-sidebar-title { font-size: 11px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--label); margin-bottom: 10px; padding-left: 20px; }
.ap-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 20px; font-size: 13px; font-weight: 500; color: var(--text-sub); cursor: pointer; transition: all 0.15s; border: none; background: none; font-family: 'DM Sans', sans-serif; text-align: left; width: 100%; }
.ap-nav-item:hover { background: rgba(58,107,80,0.07); color: var(--green); }
.ap-nav-item.active { background: var(--green-pale); color: var(--green); font-weight: 600; }
.ap-nav-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); flex-shrink: 0; transition: background 0.15s; }
.ap-nav-item.active .ap-nav-dot { background: var(--green); }
.ap-sidebar-progress { margin: auto 16px 0; background: var(--green-pale); border-radius: var(--radius-sm); padding: 16px; border: 1px solid rgba(58,107,80,0.15); }
.ap-progress-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--label); margin-bottom: 8px; }
.ap-progress-bar { height: 6px; background: rgba(58,107,80,0.12); border-radius: 99px; overflow: hidden; }
.ap-progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--green), var(--green-light)); transition: width 0.4s; }
.ap-progress-text { font-size: 12px; color: var(--text-sub); margin-top: 6px; }

/* ── Main content ── */
.ap-main { padding: 40px 38px 110px 32px; display: flex; flex-direction: column; gap: 22px; overflow-y: auto; }

/* ── Page Header ── */
.ap-page-header { margin-bottom: 4px; }
.ap-page-header h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.8px; }
.ap-page-header p { font-size: 13px; color: var(--text-sub); margin-top: 4px; }
.ap-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-sub); margin-bottom: 6px; }
.ap-breadcrumb a { color: var(--green); text-decoration: none; font-weight: 500; }

/* ── Section Card ── */
.ap-section-card { background: var(--card); border-radius: var(--radius); padding: 26px 28px; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); scroll-margin-top: 20px; animation: apFadeUp 0.3s ease both; }
.ap-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
.ap-section-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--green-pale); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-section-title { font-size: 16px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
.ap-section-sub { font-size: 12px; color: var(--text-sub); margin-top: 2px; }

/* ── Form grid ── */
.ap-form-row { display: grid; gap: 14px; margin-bottom: 14px; }
.ap-form-row.cols-2 { grid-template-columns: 1fr 1fr; }
.ap-form-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.ap-form-row.cols-1 { grid-template-columns: 1fr; }
.ap-form-row:last-child { margin-bottom: 0; }

/* ── Field ── */
.ap-field { display: flex; flex-direction: column; gap: 5px; }
.ap-field label { font-size: 12px; font-weight: 600; color: var(--text); }
.ap-field label .req { color: var(--red); margin-left: 2px; }
.ap-field label .hint { font-size: 11px; font-weight: 400; color: var(--text-sub); margin-left: 6px; }
.ap-field input, .ap-field textarea, .ap-field select {
  width: 100%; padding: 10px 13px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border); background: #FAFAF7;
  font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--text);
  outline: none; transition: border-color 0.17s, box-shadow 0.17s, background 0.17s;
  appearance: none; -webkit-appearance: none;
}
.ap-field input:focus, .ap-field textarea:focus, .ap-field select:focus {
  border-color: var(--border-focus); background: #fff;
  box-shadow: 0 0 0 3px rgba(58,107,80,0.08);
}
.ap-field textarea { resize: vertical; min-height: 110px; line-height: 1.55; }

.ap-select-wrap { position: relative; }
.ap-select-wrap select { padding-right: 36px; cursor: pointer; }
.ap-select-wrap::after { content: ''; position: absolute; right: 13px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid var(--label); pointer-events: none; }

.ap-prefix-wrap { position: relative; }
.ap-prefix-wrap .prefix { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--green); font-weight: 600; font-family: 'DM Mono', monospace; pointer-events: none; }
.ap-prefix-wrap input { padding-left: 26px; }

/* ── Size selector ── */
.ap-sizes-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.ap-size-btn { width: 54px; height: 54px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: #FAFAF7; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-sub); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
.ap-size-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-pale); }
.ap-size-btn.selected { background: var(--green); color: #fff; border-color: var(--green); box-shadow: 0 2px 8px rgba(58,107,80,0.3); }

/* Stock per size table */
.ap-size-stock-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; padding: 16px; background: #F9F8F3; border-radius: var(--radius-sm); border: 1px solid var(--border); }
.ap-size-stock-item label { font-size: 11px; font-weight: 600; color: var(--text-sub); display: block; margin-bottom: 4px; }

/* ── Color tags ── */
.ap-color-tags { display: flex; flex-wrap: wrap; gap: 6px; min-height: 32px; align-items: flex-start; margin-bottom: 8px; }
.ap-color-tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 500; background: var(--green-pale); color: var(--green); border: 1px solid rgba(58,107,80,0.2); }
.ap-color-tag button { background: none; border: none; cursor: pointer; color: inherit; font-size: 14px; line-height: 1; padding: 0; opacity: 0.6; }
.ap-color-input-row { display: flex; gap: 8px; align-items: center; }
.ap-color-input-row input { flex: 1; }
.ap-add-color-btn { padding: 10px 16px; border-radius: var(--radius-sm); background: var(--green); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; border: none; cursor: pointer; white-space: nowrap; transition: background 0.15s; }

/* ── Toggle switch ── */
.ap-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: #FAFAF7; transition: border-color 0.15s, background 0.15s; cursor: pointer; }
.ap-toggle-row:hover { border-color: rgba(58,107,80,0.2); background: var(--green-pale); }
.ap-toggle-row.active { border-color: rgba(58,107,80,0.3); background: var(--green-pale); }
.ap-toggle-label { display: flex; align-items: center; gap: 10px; pointer-events: none; }
.ap-tl-icon { font-size: 18px; }
.ap-tl-title { font-size: 13px; font-weight: 600; color: var(--text); }
.ap-tl-sub { font-size: 11px; color: var(--text-sub); }
.ap-switch { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
.ap-switch input { opacity: 0; width: 0; height: 0; }
.ap-slider { position: absolute; inset: 0; background: #D0D5C8; border-radius: 99px; cursor: pointer; transition: background 0.2s; }
.ap-slider::before { content: ''; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.ap-switch input:checked + .ap-slider { background: var(--green); }
.ap-switch input:checked + .ap-slider::before { transform: translateX(20px); }

/* ── Upload zone ── */
.ap-upload-zone { border: 2px dashed rgba(58,107,80,0.25); border-radius: var(--radius-sm); background: #FAFAF7; text-align: center; padding: 28px 20px; cursor: pointer; transition: all 0.18s; position: relative; }
.ap-upload-zone:hover { border-color: var(--green); background: var(--green-pale); }
.ap-upload-zone input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.ap-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 8px; margin-top: 12px; }
.ap-preview-thumb { position: relative; width: 100%; aspect-ratio: 1; border-radius: 10px; overflow: hidden; border: 2px solid var(--border); background: var(--bg); }
.ap-preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
.ap-remove-img { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.55); color: #fff; border: none; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; }

/* ── Sticky footer ── */
.ap-form-footer { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 13px 32px; display: flex; align-items: center; justify-content: space-between; z-index: 50; }
.ap-footer-left { font-size: 12px; color: var(--text-sub); }
.ap-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.17s; }
.ap-btn-ghost { background: transparent; color: var(--text-sub); border: 1.5px solid var(--border); }
.ap-btn-ghost:hover { border-color: var(--green); color: var(--green); }
.ap-btn-danger { background: var(--red-soft); color: var(--red); border: 1.5px solid rgba(192,57,43,0.18); }
.ap-btn-danger:hover { background: var(--red); color: #fff; }
.ap-btn-primary { background: var(--green); color: #fff; box-shadow: 0 2px 10px rgba(58,107,80,0.25); }
.ap-btn-primary:hover { background: #2e5640; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(58,107,80,0.3); }
.ap-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ── Toast ── */
.ap-toast { position: fixed; bottom: 80px; right: 24px; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.15); font-family: 'DM Sans', sans-serif; }
.ap-toast.success { background: var(--green); color: #fff; }
.ap-toast.error { background: var(--red); color: #fff; }

@keyframes apFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

@media (max-width: 900px) {
  .ap-layout { grid-template-columns: 1fr; }
  .ap-sidebar { display: none; }
  .ap-main { padding: 20px 14px 100px; }
}
`;

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

const SUB_CATS: Record<string, string[]> = {
  kurtis: ['Short Kurtis', 'Long Kurtis', 'Anarkali', 'Straight Cut', 'Flared'],
  suits: ['3-Piece Suit', '2-Piece Set', 'Palazzo Set', 'Sharara Set', 'Pant Suit'],
  sarees: ['Cotton Sarees', 'Silk Sarees', 'Banarasi', 'Georgette', 'Chiffon'],
  lehengas: ['Bridal Lehenga', 'Party Wear', 'Chaniya Choli', 'Mini Lehenga'],
  tops: ['Crop Tops', 'Peplum Tops', 'Tunic Tops', 'Blouses'],
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const mainFileRef = useRef<HTMLInputElement>(null);
  const gridFileRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [error, setError] = useState<string | null>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [occasion, setOccasion] = useState('');
  const [washCare, setWashCare] = useState('');
  const [origin, setOrigin] = useState('India');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [theme, setTheme] = useState('');
  const [collection, setCollection] = useState('');
  const [tags, setTags] = useState('');
  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [stockQty, setStockQty] = useState('');
  const [sku, setSku] = useState('');
  const [priceOld, setPriceOld] = useState('');
  const [priceNew, setPriceNew] = useState('');
  const [couponAllowed, setCouponAllowed] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);
  const [mainImageFiles, setMainImageFiles] = useState<File[]>([]);
  const [gridImageUrls, setGridImageUrls] = useState<string[]>([]);
  const [gridImagePreviews, setGridImagePreviews] = useState<string[]>([]);
  const [gridImageFiles, setGridImageFiles] = useState<File[]>([]);
  const [video, setVideo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFestive, setIsFestive] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Load Categories
  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => {
      if (data.success) setDbCategories(data.categories);
    });
  }, []);

  // Load Product Data
  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (!data) throw new Error("No product data received");

        setName(data.name || '');
        setDescription(data.description || '');
        setFabric(data.fabric || '');
        setOccasion(data.occasion || '');
        setWashCare(data.washCare || '');
        setOrigin(data.countryOfOrigin || 'India');
        setCategory(data.category || '');
        setSubCategory(data.subCategory || '');
        setTheme(data.categoryTheme || '');
        setCollection(data.collection || '');
        setTags(data.tags?.join(', ') || '');
        setSizes(Array.isArray(data.sizes) ? data.sizes.map((s: any) => typeof s === 'string' ? { size: s, stock: 0 } : s) : []);
        setColors(data.colors || []);
        setStockQty(data.quantity?.toString() || '0');
        setSku(data.sku || '');
        setPriceOld(data.priceOld?.toString() || '');
        setPriceNew(data.priceNew?.toString() || '');
        setCouponAllowed(data.couponAllowed || false);
        setMainImageUrl(data.mainImage || '');
        setMainImagePreviews(data.mainImage ? [data.mainImage] : []);
        setGridImageUrls(data.gridImages || []);
        setGridImagePreviews(data.gridImages || []);
        setVideo(data.video || '');
        setIsActive(data.isActive ?? true);
        setIsFeatured(data.isFeatured || false);
        setIsBestSeller(data.isBestSeller || false);
        setIsFestive(data.isFestive || false);
        setIsNewArrival(data.isNewArrival || false);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // Progress
  const filledSections = [
    name.trim(),
    description.trim(),
    fabric.trim(),
    category,
    sizes.length > 0,
    priceOld && priceNew,
  ].filter(Boolean).length;
  const progressPct = Math.round((filledSections / 6) * 100);

  // Size toggle
  const toggleSize = (s: string) => {
    setSizes(prev => {
      const exists = prev.find(x => x.size === s);
      if (exists) return prev.filter(x => x.size !== s);
      return [...prev, { size: s, stock: 0 }];
    });
  };

  const updateSizeStock = (s: string, stock: number) => {
    setSizes(prev => prev.map(x => x.size === s ? { ...x, stock } : x));
  };

  // Colors
  const addColor = () => {
    const val = colorInputRef.current?.value.trim();
    if (!val) return;
    val.split(',').map(c => c.trim()).filter(Boolean).forEach(c => {
      if (!colors.includes(c)) setColors(prev => [...prev, c]);
    });
    if (colorInputRef.current) colorInputRef.current.value = '';
  };

  // Discount
  const mrpNum = parseFloat(priceOld) || 0;
  const sellNum = parseFloat(priceNew) || 0;
  const discPct = mrpNum > 0 && sellNum > 0 ? Math.max(0, Math.round((1 - sellNum / mrpNum) * 100)) : 0;

  // Image upload helper
  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
    const data = await res.json();
    return data.url;
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    const t = document.createElement('div');
    t.className = `ap-toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2500);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  const handleSubmit = async () => {
    if (!name || !priceNew) { showToast('Required fields missing', 'error'); return; }
    setLoading(true);
    try {
      let mainImg = mainImageUrl;
      if (mainImageFiles[0]) mainImg = await uploadImage(mainImageFiles[0]);

      const newGridImgs = await Promise.all(gridImageFiles.map(uploadImage));
      const finalGridImgs = [...gridImageUrls, ...newGridImgs];

      const totalQuantity = sizes.reduce((acc, s) => acc + s.stock, 0) || parseInt(stockQty) || 0;

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, description, fabric, occasion, washCare, countryOfOrigin: origin,
          category, subCategory, categoryTheme: theme, collection, tags: tags ? tags.split(',').map(t => t.trim()) : [],
          sizes, colors, quantity: totalQuantity, sku,
          priceOld: parseFloat(priceOld) || 0, priceNew: parseFloat(priceNew) || 0,
          discountPercent: discPct, couponAllowed,
          mainImage: mainImg, gridImages: finalGridImgs, video,
          isActive, isFeatured, isBestSeller, isFestive, isNewArrival,
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      showToast('Product updated successfully! ✨', 'success');
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (e) {
      showToast('Failed to update product', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'DM Sans' }}>
        <h2 style={{ color: 'var(--red)' }}>⚠️ {error}</h2>
        <button className="ap-btn ap-btn-primary" style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (loading && !name) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', fontFamily: 'DM Sans', color: 'var(--text-sub)' }}>
        <p>Loading Product Data...</p>
      </div>
    );
  }

  return (
    <div className="ap-page">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className="ap-layout">
        <aside className="ap-sidebar">
          <div className="ap-sidebar-title">Sections</div>
          {[
            { id: 'basic', label: 'Basic Details' },
            { id: 'category', label: 'Category' },
            { id: 'variants', label: 'Variants & Stock' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'media', label: 'Product Media' },
            { id: 'status', label: 'Status & Tags' },
          ].map(s => (
            <button key={s.id} className={`ap-nav-item${activeSection === s.id ? ' active' : ''}`} onClick={() => scrollToSection(s.id)}>
              <div className="ap-nav-dot" />
              {s.label}
            </button>
          ))}
          <div className="ap-sidebar-progress">
            <div className="ap-progress-label">Completion</div>
            <div className="ap-progress-bar">
              <div className="ap-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="ap-progress-text">{filledSections} of 6 sections</div>
          </div>
        </aside>

        <main className="ap-main">
          <div className="ap-page-header">
            <div className="ap-breadcrumb">
              <Link href="/admin/products">Products</Link>
              <span>›</span>
              <span>Edit Product</span>
            </div>
            <h1>Edit Product</h1>
            <p>Modify existing product details and availability</p>
          </div>

          {/* Section: Basic */}
          <div className="ap-section-card" id="basic">
            <div className="ap-section-header">
              <div className="ap-section-icon">📝</div>
              <div><div className="ap-section-title">Basic Details</div><div className="ap-section-sub">Essential information</div></div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Product Title <span className="req">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Description <span className="req">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={600} />
              </div>
            </div>
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>Fabric <span className="req">*</span></label>
                <input value={fabric} onChange={e => setFabric(e.target.value)} />
              </div>
              <div className="ap-field">
                <label>Occasion</label>
                <div className="ap-select-wrap">
                  <select value={occasion} onChange={e => setOccasion(e.target.value)}>
                    <option value="">Select</option>
                    <option>Casual</option><option>Festive</option><option>Party</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Category */}
          <div className="ap-section-card" id="category">
            <div className="ap-section-header">
              <div className="ap-section-icon">📁</div>
              <div><div className="ap-section-title">Category</div><div className="ap-section-sub">Placement in store</div></div>
            </div>
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>Category <span className="req">*</span></label>
                <div className="ap-select-wrap">
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {dbCategories.map(cat => <option key={cat._id} value={cat.title}>{cat.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="ap-field">
                <label>Sub Category</label>
                <div className="ap-select-wrap">
                  <select value={subCategory} onChange={e => setSubCategory(e.target.value)}>
                    <option value="">Select Sub Category</option>
                    {(SUB_CATS[category.toLowerCase()] || SUB_CATS[category] || []).map(s => (
                      <option key={s} value={s.toLowerCase().replace(/ /g, '-')}>{s}</option>
                    ))}
                  </select>
                </div>
                {!SUB_CATS[category.toLowerCase()] && !SUB_CATS[category] && (
                  <input
                    placeholder="Enter sub category"
                    value={subCategory}
                    onChange={e => setSubCategory(e.target.value)}
                    style={{ marginTop: '8px' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section: Variants */}
          <div className="ap-section-card" id="variants">
            <div className="ap-section-header">
              <div className="ap-section-icon">📐</div>
              <div><div className="ap-section-title">Variants & Stock</div><div className="ap-section-sub">Inventory management</div></div>
            </div>
            <div className="ap-form-row cols-1">
              <label>Sizes <span className="req">*</span></label>
              <div className="ap-sizes-grid">
                {SIZE_OPTIONS.map(s => (
                  <button key={s} type="button" className={`ap-size-btn${sizes.some(x => x.size === s) ? ' selected' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
                ))}
              </div>
            </div>
            {sizes.length > 0 && (
              <div className="ap-size-stock-grid">
                {sizes.map(s => (
                  <div key={s.size} className="ap-size-stock-item">
                    <label>{s.size}</label>
                    <input type="number" value={s.stock} onChange={e => updateSizeStock(s.size, parseInt(e.target.value) || 0)} />
                  </div>
                ))}
              </div>
            )}
            <div className="ap-form-row cols-3" style={{ marginTop: '20px' }}>
              <div className="ap-field"><label>Colours</label><input value={colors.join(', ')} onChange={e => setColors(e.target.value.split(',').map(c => c.trim()))} /></div>
              <div className="ap-field"><label>Total Qty</label><input type="number" value={stockQty} onChange={e => setStockQty(e.target.value)} /></div>
              <div className="ap-field"><label>SKU</label><input value={sku} onChange={e => setSku(e.target.value)} /></div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="ap-section-card" id="pricing">
            <div className="ap-section-header">
              <div className="ap-section-icon">💰</div>
              <div><div className="ap-section-title">Pricing</div><div className="ap-section-sub">Financial details</div></div>
            </div>
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>MRP <span className="req">*</span></label>
                <div className="ap-prefix-wrap"><span className="prefix">₹</span><input type="number" value={priceOld} onChange={e => setPriceOld(e.target.value)} /></div>
              </div>
              <div className="ap-field">
                <label>Price <span className="req">*</span></label>
                <div className="ap-prefix-wrap"><span className="prefix">₹</span><input type="number" value={priceNew} onChange={e => setPriceNew(e.target.value)} /></div>
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className={`ap-toggle-row${couponAllowed ? ' active' : ''}`} onClick={() => setCouponAllowed(!couponAllowed)}>
                <div className="ap-toggle-label"><span>Allow Coupons</span></div>
                <label className="ap-switch"><input type="checkbox" checked={couponAllowed} readOnly /><span className="ap-slider" /></label>
              </div>
            </div>
          </div>

          {/* Section: Media */}
          <div className="ap-section-card" id="media">
            <div className="ap-section-header">
              <div className="ap-section-icon">🖼️</div>
              <div><div className="ap-section-title">Product Media</div><div className="ap-section-sub">Images and Video</div></div>
            </div>
            <div className="ap-field">
              <label>Main Image</label>
              <div className="ap-upload-zone">
                <input type="file" onChange={e => {
                  if (e.target.files?.[0]) {
                    setMainImageFiles([e.target.files[0]]);
                    setMainImagePreviews([URL.createObjectURL(e.target.files[0])]);
                  }
                }} />
                {mainImagePreviews[0] ? <img src={mainImagePreviews[0]} style={{ width: '100px', borderRadius: '8px' }} /> : <span>Click to change main image</span>}
              </div>
            </div>
          </div>

          {/* Section: Status */}
          <div className="ap-section-card" id="status">
            <div className="ap-section-header">
              <div className="ap-section-icon">✅</div>
              <div><div className="ap-section-title">Status & Tags</div><div className="ap-section-sub">Visibility settings</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Active', val: isActive, set: setIsActive },
                { label: 'Featured', val: isFeatured, set: setIsFeatured },
                { label: 'Best Seller', val: isBestSeller, set: setIsBestSeller },
                { label: 'Festive', val: isFestive, set: setIsFestive },
                { label: 'New Arrival', val: isNewArrival, set: setIsNewArrival },
              ].map(t => (
                <div key={t.label} className={`ap-toggle-row${t.val ? ' active' : ''}`} onClick={() => t.set(!t.val)}>
                  <div className="ap-toggle-label"><span>{t.label}</span></div>
                  <label className="ap-switch"><input type="checkbox" checked={t.val} readOnly /><span className="ap-slider" /></label>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <div className="ap-form-footer">
        <div className="ap-footer-left">Editing: <strong>{name || 'Product'}</strong></div>
        <div className="ap-footer-btns">
          <button className="ap-btn ap-btn-ghost" onClick={() => router.back()}>Cancel</button>
          <button className="ap-btn ap-btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Update Product'}</button>
        </div>
      </div>
    </div>
  );
}
