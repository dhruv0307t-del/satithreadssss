"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
.ap-section-card:nth-child(3) { animation-delay: 0.05s; }
.ap-section-card:nth-child(4) { animation-delay: 0.10s; }
.ap-section-card:nth-child(5) { animation-delay: 0.15s; }
.ap-section-card:nth-child(6) { animation-delay: 0.20s; }
.ap-section-card:nth-child(7) { animation-delay: 0.25s; }
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
.ap-field input::placeholder, .ap-field textarea::placeholder { color: #B0B5A8; }
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
.ap-size-btn.freesize { width: auto; padding: 0 14px; }

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
.ap-add-color-btn:hover { background: #2e5640; }

/* ── Price preview ── */
.ap-price-preview { background: var(--green-pale); border-radius: var(--radius-sm); padding: 14px 16px; margin-top: 10px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; border: 1px solid rgba(58,107,80,0.15); }
.ap-pp-item { font-size: 12px; color: var(--text-sub); }
.ap-pp-item strong { font-size: 14px; font-weight: 700; color: var(--green); }
.ap-pp-disc { font-size: 13px; font-weight: 700; color: #C07A20; }

/* ── Toggle switch ── */
.ap-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: #FAFAF7; transition: border-color 0.15s, background 0.15s; cursor: pointer; }
.ap-toggle-row:hover { border-color: rgba(58,107,80,0.2); background: var(--green-pale); }
.ap-toggle-row.active { border-color: rgba(58,107,80,0.3); background: var(--green-pale); }
.ap-toggle-label { display: flex; align-items: center; gap: 10px; pointer-events: none; }
.ap-tl-icon { font-size: 18px; }
.ap-tl-title { display: block; font-size: 13px; font-weight: 600; color: var(--text); }
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
.ap-upload-icon { font-size: 30px; margin-bottom: 8px; }
.ap-upload-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.ap-upload-sub { font-size: 12px; color: var(--text-sub); }
.ap-upload-sub strong { color: var(--green); }
.ap-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 8px; margin-top: 12px; }
.ap-preview-thumb { position: relative; width: 100%; aspect-ratio: 1; border-radius: 10px; overflow: hidden; border: 2px solid var(--border); background: var(--bg); }
.ap-preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
.ap-preview-thumb .ap-remove-img { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.55); color: #fff; border: none; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; }
.ap-preview-thumb.main-thumb { border-color: var(--green); }
.ap-main-label { position: absolute; bottom: 4px; left: 4px; background: var(--green); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase; }

/* ── Grid upload row ── */
.ap-grid-upload { display: flex; align-items: center; gap: 12px; padding: 13px 15px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: #FAFAF7; }
.ap-grid-upload-info { flex: 1; }
.ap-grid-upload-info strong { font-size: 13px; display: block; color: var(--text); }
.ap-grid-upload-info span { font-size: 11px; color: var(--text-sub); }
.ap-grid-upload-btn { padding: 8px 16px; border-radius: 99px; background: var(--green); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; border: none; cursor: pointer; position: relative; overflow: hidden; transition: background 0.15s; }
.ap-grid-upload-btn:hover { background: #2e5640; }
.ap-grid-upload-btn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

/* ── Status toggles gap ── */
.ap-toggle-group { display: flex; flex-direction: column; gap: 10px; }

/* ── Sticky footer ── */
.ap-form-footer { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-top: 1px solid var(--border); padding: 13px 32px; display: flex; align-items: center; justify-content: space-between; z-index: 50; }
.ap-footer-left { font-size: 12px; color: var(--text-sub); }
.ap-footer-left strong { color: var(--text); }
.ap-footer-btns { display: flex; gap: 10px; }
.ap-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.17s; }
.ap-btn-ghost { background: transparent; color: var(--text-sub); border: 1.5px solid var(--border); }
.ap-btn-ghost:hover { border-color: var(--green); color: var(--green); }
.ap-btn-primary { background: var(--green); color: #fff; box-shadow: 0 2px 10px rgba(58,107,80,0.25); }
.ap-btn-primary:hover { background: #2e5640; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(58,107,80,0.3); }
.ap-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ── Toast ── */
.ap-toast { position: fixed; bottom: 80px; right: 24px; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.15); font-family: 'DM Sans', sans-serif; }
.ap-toast.success { background: var(--green); color: #fff; }
.ap-toast.error { background: var(--red); color: #fff; }

/* ── Char count ── */
.ap-char-count { font-size: 11px; color: var(--text-sub); font-family: 'DM Mono', monospace; text-align: right; margin-top: 3px; }
.ap-field-divider { height: 1px; background: var(--border); margin: 6px 0 12px; }

/* ── Animations ── */
@keyframes apFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

@media (max-width: 900px) {
  .ap-layout { grid-template-columns: 1fr; }
  .ap-sidebar { display: none; }
  .ap-main { padding: 20px 14px 100px; }
  .ap-form-row.cols-2, .ap-form-row.cols-3 { grid-template-columns: 1fr; }
  .ap-size-stock-grid { grid-template-columns: 1fr 1fr; }
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

interface DbCategory {
  _id: string;
  title: string;
  slug: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const mainFileRef = useRef<HTMLInputElement>(null);
  const gridFileRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  // Dynamic Categories
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([]);
  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => {
      if (data.success) setDbCategories(data.categories);
    });
  }, []);

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
  const [gridImagePreviews, setGridImagePreviews] = useState<string[]>([]);
  const [gridImageFiles, setGridImageFiles] = useState<File[]>([]);
  const [video, setVideo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFestive, setIsFestive] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Progress calculation
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

  // Discount calculation
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

  const handleMainFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => setMainImagePreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
      setMainImageFiles(prev => [...prev, file]);
    });
  };

  const handleGridFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => setGridImagePreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
      setGridImageFiles(prev => [...prev, file]);
    });
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
    if (!name || !priceNew) { showToast('Please fill all required fields', 'error'); return; }
    if (mainImageFiles.length === 0 && !mainImageUrl) { showToast('Please add a main product image', 'error'); return; }
    setLoading(true);
    try {
      let mainImg = mainImageUrl;
      if (mainImageFiles[0]) mainImg = await uploadImage(mainImageFiles[0]);
      const gridImgs = await Promise.all(gridImageFiles.map(uploadImage));
      const totalQuantity = sizes.reduce((acc, s) => acc + s.stock, 0) || parseInt(stockQty) || 0;

      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, description, fabric, occasion, washCare, countryOfOrigin: origin,
          category, subCategory, categoryTheme: theme, collection, tags: tags ? tags.split(',').map(t => t.trim()) : [],
          sizes, colors, quantity: totalQuantity, sku,
          priceOld: parseFloat(priceOld) || 0, priceNew: parseFloat(priceNew) || 0,
          discountPercent: discPct, couponAllowed,
          mainImage: mainImg, gridImages: gridImgs, video,
          isActive, isFeatured, isBestSeller, isFestive, isNewArrival,
        }),
      });
      showToast('Product created successfully! 🎉', 'success');
      setTimeout(() => router.push('/admin/products'), 1500);
    } catch (e) {
      showToast('Failed to create product. Try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="ap-page">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className="ap-layout">
        {/* Sidebar */}
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
            <div className="ap-progress-label">Form completion</div>
            <div className="ap-progress-bar">
              <div className="ap-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="ap-progress-text">{filledSections} of 6 sections filled</div>
          </div>
        </aside>

        {/* Main */}
        <main className="ap-main">
          {/* Header */}
          <div className="ap-page-header">
            <div className="ap-breadcrumb">
              <Link href="/admin/products" className="ap-breadcrumb-link" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 500 }}>Products</Link>
              <span style={{ opacity: 0.4 }}>›</span>
              <span>Add New</span>
            </div>
            <h1>Add New Product</h1>
            <p>Create a new product listing for your store</p>
          </div>

          {/* ── 1. Basic Details ── */}
          <div className="ap-section-card" id="basic">
            <div className="ap-section-header">
              <div className="ap-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </div>
              <div>
                <div className="ap-section-title">Basic Details</div>
                <div className="ap-section-sub">Name, description, and fabric info</div>
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Product Title <span className="req">*</span></label>
                <input type="text" placeholder="e.g. Genda Phool Short Kurti" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Description <span className="req">*</span><span className="hint">Write a compelling product description</span></label>
                <textarea placeholder="Describe the product — style, occasion, fit, and care instructions…" maxLength={600} value={description} onChange={e => setDescription(e.target.value)} />
                <div className="ap-char-count">{description.length} / 600</div>
              </div>
            </div>
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>Fabric <span className="req">*</span></label>
                <input type="text" placeholder="e.g. Pure Cotton, Rayon, Silk Blend" value={fabric} onChange={e => setFabric(e.target.value)} />
              </div>
              <div className="ap-field">
                <label>Occasion</label>
                <div className="ap-select-wrap">
                  <select value={occasion} onChange={e => setOccasion(e.target.value)}>
                    <option value="">Select occasion</option>
                    <option>Casual</option><option>Festive</option><option>Party</option>
                    <option>Office</option><option>Wedding</option><option>Daily Wear</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>Wash Care</label>
                <div className="ap-select-wrap">
                  <select value={washCare} onChange={e => setWashCare(e.target.value)}>
                    <option value="">Select wash care</option>
                    <option>Hand Wash Only</option><option>Machine Wash Cold</option>
                    <option>Dry Clean Only</option><option>Do Not Bleach</option>
                  </select>
                </div>
              </div>
              <div className="ap-field">
                <label>Country of Origin</label>
                <input type="text" placeholder="e.g. India" value={origin} onChange={e => setOrigin(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── 2. Category ── */}
          <div className="ap-section-card" id="category">
            <div className="ap-section-header">
              <div className="ap-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
              </div>
              <div>
                <div className="ap-section-title">Category</div>
                <div className="ap-section-sub">Organise your product in the right collection</div>
              </div>
            </div>
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>Category <span className="req">*</span></label>
                <div className="ap-select-wrap">
                  <select
                    value={category}
                    onChange={e => {
                      setCategory(e.target.value);
                      setSubCategory('');
                    }}
                  >
                    <option value="">Select Category</option>
                    {dbCategories.map(cat => (
                      <option key={cat._id} value={cat.title}>{cat.title}</option>
                    ))}
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
              </div>
            </div>
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>Theme / Model</label>
                <input type="text" placeholder="e.g. Floral, Ethnic Fusion, Printed" value={theme} onChange={e => setTheme(e.target.value)} />
              </div>
              <div className="ap-field">
                <label>Collection</label>
                <input type="text" placeholder="e.g. Summer 2026, Festive Edit" value={collection} onChange={e => setCollection(e.target.value)} />
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Tags <span className="hint">Comma separated · helps with search</span></label>
                <input type="text" placeholder="e.g. kurti, cotton, summer, floral, ethnic" value={tags} onChange={e => setTags(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── 3. Variants & Stock ── */}
          <div className="ap-section-card" id="variants">
            <div className="ap-section-header">
              <div className="ap-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" /></svg>
              </div>
              <div>
                <div className="ap-section-title">Variants & Stock</div>
                <div className="ap-section-sub">Sizes, colours, and inventory levels</div>
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Select Sizes Available <span className="req">*</span></label>
                <div className="ap-sizes-grid">
                  {SIZE_OPTIONS.map(s => (
                    <button key={s} type="button" className={`ap-size-btn${sizes.some(x => x.size === s) ? ' selected' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
                  ))}
                  <button type="button" className={`ap-size-btn ap-size-btn freesize${sizes.some(x => x.size === 'Free Size') ? ' selected' : ''}`} onClick={() => toggleSize('Free Size')}>Free Size</button>
                </div>
              </div>
            </div>
            {sizes.length > 0 && (
              <div className="ap-size-stock-grid">
                {sizes.map(s => (
                  <div key={s.size} className="ap-size-stock-item">
                    <label>Size {s.size}</label>
                    <input type="number" min="0" value={s.stock} onChange={e => updateSizeStock(s.size, parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none', background: '#fff' }} />
                  </div>
                ))}
              </div>
            )}
            <div className="ap-form-row cols-1" style={{ marginTop: '14px' }}>
              <div className="ap-field">
                <label>Colours Available</label>
                <div className="ap-color-tags">
                  {colors.map(c => (
                    <div key={c} className="ap-color-tag">{c}<button onClick={() => setColors(prev => prev.filter(x => x !== c))}>×</button></div>
                  ))}
                </div>
                <div className="ap-color-input-row">
                  <input ref={colorInputRef} type="text" placeholder="Type a colour and press Add…" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addColor(); } }} style={{ flex: 1, padding: '10px 13px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: '#FAFAF7', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', outline: 'none' }} />
                  <button type="button" className="ap-add-color-btn" onClick={addColor}>+ Add</button>
                </div>
              </div>
            </div>
            <div className="ap-form-row cols-3">
              <div className="ap-field">
                <label>Total Stock <span className="req">*</span></label>
                <input type="number" placeholder="e.g. 200" min="0" value={stockQty} onChange={e => setStockQty(e.target.value)} />
              </div>
              <div className="ap-field">
                <label>Low Stock Alert</label>
                <input type="number" placeholder="e.g. 20" min="0" />
              </div>
              <div className="ap-field">
                <label>SKU / Product Code</label>
                <input type="text" placeholder="e.g. SKU-GFK-001" value={sku} onChange={e => setSku(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── 4. Pricing ── */}
          <div className="ap-section-card" id="pricing">
            <div className="ap-section-header">
              <div className="ap-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
              </div>
              <div>
                <div className="ap-section-title">Pricing</div>
                <div className="ap-section-sub">Set selling price, MRP, and discounts</div>
              </div>
            </div>
            <div className="ap-form-row cols-3">
              <div className="ap-field">
                <label>MRP (Old Price) <span className="req">*</span></label>
                <div className="ap-prefix-wrap">
                  <span className="prefix">₹</span>
                  <input type="number" placeholder="0" min="0" value={priceOld} onChange={e => setPriceOld(e.target.value)} />
                </div>
              </div>
              <div className="ap-field">
                <label>Selling Price (New Price) <span className="req">*</span></label>
                <div className="ap-prefix-wrap">
                  <span className="prefix">₹</span>
                  <input type="number" placeholder="0" min="0" value={priceNew} onChange={e => setPriceNew(e.target.value)} />
                </div>
              </div>
              <div className="ap-field">
                <label>Discount %</label>
                <div className="ap-prefix-wrap">
                  <span className="prefix" style={{ color: 'var(--amber)' }}>%</span>
                  <input type="number" value={discPct || ''} readOnly placeholder="Auto-calculated" style={{ background: '#F5F5F0', color: 'var(--amber)', fontWeight: 600 }} />
                </div>
              </div>
            </div>
            {mrpNum > 0 && sellNum > 0 && (
              <div className="ap-price-preview">
                <div className="ap-pp-item">MRP: <strong>₹{mrpNum.toLocaleString('en-IN')}</strong></div>
                <div className="ap-pp-item">Selling: <strong>₹{sellNum.toLocaleString('en-IN')}</strong></div>
                <div className="ap-pp-item">You save: <strong className="ap-pp-disc">₹{(mrpNum - sellNum).toLocaleString('en-IN')} ({discPct}% off)</strong></div>
                <div className="ap-pp-item">Margin: <strong>{((mrpNum - sellNum) / mrpNum * 100).toFixed(1)}%</strong></div>
              </div>
            )}
            <div className="ap-field-divider" style={{ marginTop: '18px' }} />
            <div className="ap-form-row cols-2">
              <div className="ap-field">
                <label>GST / Tax Rate</label>
                <div className="ap-select-wrap">
                  <select>
                    <option>0% (Exempt)</option><option>5%</option>
                    <option defaultValue="selected">12%</option>
                    <option>18%</option><option>28%</option>
                  </select>
                </div>
              </div>
              <div className="ap-field">
                <label>Shipping Charge</label>
                <div className="ap-prefix-wrap">
                  <span className="prefix">₹</span>
                  <input type="number" placeholder="0 = Free shipping" min="0" defaultValue="0" />
                </div>
              </div>
            </div>
            <div className="ap-form-row cols-1" style={{ marginTop: '6px' }}>
              <div className={`ap-toggle-row${couponAllowed ? ' active' : ''}`} onClick={() => setCouponAllowed(v => !v)}>
                <div className="ap-toggle-label">
                  <div className="ap-tl-icon">🏷️</div>
                  <div>
                    <span className="ap-tl-title">Coupon Allowed</span>
                    <span className="ap-tl-sub">Allow customers to apply discount coupons</span>
                  </div>
                </div>
                <label className="ap-switch" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={couponAllowed} onChange={e => setCouponAllowed(e.target.checked)} />
                  <span className="ap-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* ── 5. Product Media ── */}
          <div className="ap-section-card" id="media">
            <div className="ap-section-header">
              <div className="ap-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              </div>
              <div>
                <div className="ap-section-title">Product Media</div>
                <div className="ap-section-sub">Main image, gallery photos, and video</div>
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Main Product Image <span className="req">*</span><span className="hint">First image = cover photo</span></label>
                <div className="ap-upload-zone">
                  <input ref={mainFileRef} type="file" accept="image/*" multiple onChange={e => handleMainFiles(e.target.files)} />
                  <div className="ap-upload-icon">🖼️</div>
                  <div className="ap-upload-title">Drop images here or <strong style={{ color: 'var(--green)' }}>browse</strong></div>
                  <div className="ap-upload-sub">PNG, JPG, WEBP · Max 5MB each · Recommended 800×1000px</div>
                </div>
                {mainImagePreviews.length > 0 && (
                  <div className="ap-preview-grid">
                    {mainImagePreviews.map((src, i) => (
                      <div key={i} className={`ap-preview-thumb${i === 0 ? ' main-thumb' : ''}`}>
                        <img src={src} alt="" />
                        {i === 0 && <div className="ap-main-label">Main</div>}
                        <button className="ap-remove-img" onClick={() => { setMainImagePreviews(prev => prev.filter((_, j) => j !== i)); setMainImageFiles(prev => prev.filter((_, j) => j !== i)); }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Grid / Gallery Images <span className="hint">Additional product shots</span></label>
                <div className="ap-grid-upload">
                  <div className="ap-grid-upload-info">
                    <strong>Add Gallery Photos</strong>
                    <span>Multiple angles, detail shots, model photos</span>
                  </div>
                  <button className="ap-grid-upload-btn" type="button">
                    <input ref={gridFileRef} type="file" accept="image/*" multiple onChange={e => handleGridFiles(e.target.files)} />
                    + Choose Files
                  </button>
                </div>
                {gridImagePreviews.length > 0 && (
                  <div className="ap-preview-grid">
                    {gridImagePreviews.map((src, i) => (
                      <div key={i} className="ap-preview-thumb">
                        <img src={src} alt="" />
                        <button className="ap-remove-img" onClick={() => { setGridImagePreviews(prev => prev.filter((_, j) => j !== i)); setGridImageFiles(prev => prev.filter((_, j) => j !== i)); }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="ap-form-row cols-1">
              <div className="ap-field">
                <label>Video URL <span className="hint">YouTube or Vimeo link · optional</span></label>
                <input type="url" placeholder="https://youtube.com/watch?v=..." value={video} onChange={e => setVideo(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ── 6. Status & Tags ── */}
          <div className="ap-section-card" id="status">
            <div className="ap-section-header">
              <div className="ap-section-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A6B50" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <div>
                <div className="ap-section-title">Status & Tags</div>
                <div className="ap-section-sub">Control visibility and product labels</div>
              </div>
            </div>
            <div className="ap-toggle-group">
              {[
                { label: 'Active Product', sub: 'Product is live and visible to customers', icon: '✅', val: isActive, set: setIsActive },
                { label: 'Featured Product', sub: 'Appears in homepage featured section', icon: '⭐', val: isFeatured, set: setIsFeatured },
                { label: 'Best Seller', sub: 'Show "Best Seller" badge on product', icon: '🔥', val: isBestSeller, set: setIsBestSeller },
                { label: 'Festive Collection', sub: 'Part of festive / seasonal collection', icon: '🪔', val: isFestive, set: setIsFestive },
                { label: 'New Arrival', sub: 'Show "New" badge on product listing', icon: '🆕', val: isNewArrival, set: setIsNewArrival },
              ].map(t => (
                <div key={t.label} className={`ap-toggle-row${t.val ? ' active' : ''}`} onClick={() => t.set(v => !v)}>
                  <div className="ap-toggle-label">
                    <div className="ap-tl-icon">{t.icon}</div>
                    <div>
                      <span className="ap-tl-title">{t.label}</span>
                      <span className="ap-tl-sub">{t.sub}</span>
                    </div>
                  </div>
                  <label className="ap-switch" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={t.val} onChange={e => t.set(e.target.checked)} />
                    <span className="ap-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '30px' }} />
        </main>
      </div>

      {/* Sticky Footer */}
      <div className="ap-form-footer">
        <div className="ap-footer-left">
          <strong>Add New Product</strong> · All required fields must be filled before saving
        </div>
        <div className="ap-footer-btns">
          <Link href="/admin/products" className="ap-btn ap-btn-ghost" style={{ textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Cancel
          </Link>
          <button className="ap-btn ap-btn-primary" onClick={handleSubmit} disabled={loading}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            {loading ? 'Creating…' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
