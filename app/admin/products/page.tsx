"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  --border: rgba(58,107,80,0.10);
  --shadow: 0 2px 16px rgba(40,60,40,0.07), 0 1px 3px rgba(40,60,40,0.04);
  --shadow-lg: 0 16px 56px rgba(40,60,40,0.15), 0 4px 14px rgba(40,60,40,0.08);
  --red: #C0392B;
  --red-soft: #FDECEA;
  --amber: #B87620;
  --amber-soft: #FEF3E2;
  --radius: 20px;
  --radius-sm: 12px;
}

/* ── Page ── */
.p-page { width: 100%; padding: 40px 32px 60px; font-family: 'DM Sans', sans-serif; color: var(--text); }

/* ── Header ── */
.p-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.p-header h1 { font-size: 36px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
.p-header p { font-size: 13px; color: var(--text-sub); margin-top: 4px; }
.p-header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.p-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.17s; text-decoration: none; }
.p-btn-primary { background: var(--green); color: #fff; }
.p-btn-primary:hover { background: #2e5640; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(58,107,80,0.3); }
.p-btn-ghost { background: var(--card); color: var(--text-sub); border: 1.5px solid var(--border); }
.p-btn-ghost:hover { border-color: var(--green); color: var(--green); }
.p-btn-danger { background: var(--red-soft); color: var(--red); border: 1.5px solid rgba(192,57,43,0.18); }
.p-btn-danger:hover { background: var(--red); color: #fff; }

/* ── Stats strip ── */
.p-stats-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; animation: pFadeUp 0.35s ease both; }
.p-stat-card { background: var(--card); border-radius: var(--radius-sm); padding: 16px 18px; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); transition: transform 0.18s, box-shadow 0.18s; }
.p-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.p-s-label { font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--label); margin-bottom: 7px; }
.p-s-val { font-size: 26px; font-weight: 700; color: var(--green); letter-spacing: -0.5px; line-height: 1; }
.p-s-val.amber { color: var(--amber); }
.p-s-val.red { color: var(--red); }
.p-s-badge { display: inline-flex; align-items: center; gap: 3px; margin-top: 6px; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 99px; }
.p-s-badge.up { background: #E6F4EC; color: var(--green); }
.p-s-badge.warn { background: var(--amber-soft); color: var(--amber); }
.p-s-badge.neutral { background: #F0F0EA; color: var(--label); }

/* ── Toolbar ── */
.p-toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; animation: pFadeUp 0.35s 0.05s ease both; }
.p-search-wrap { position: relative; flex: 1; min-width: 200px; }
.p-search-wrap input { width: 100%; padding: 10px 14px 10px 38px; border-radius: 99px; border: 1.5px solid var(--border); background: var(--card); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.17s; box-shadow: var(--shadow); }
.p-search-wrap input:focus { border-color: var(--green); }
.p-search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); opacity: 0.4; pointer-events: none; }
.p-filter-group { display: flex; gap: 6px; flex-wrap: wrap; }
.p-filter-pill { padding: 8px 14px; border-radius: 99px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1.5px solid var(--border); background: var(--card); color: var(--text-sub); transition: all 0.15s; font-family: 'DM Sans', sans-serif; white-space: nowrap; box-shadow: var(--shadow); }
.p-filter-pill:hover { border-color: var(--green); color: var(--green); }
.p-filter-pill.active { background: var(--green); color: #fff; border-color: var(--green); }
.p-sort-select { padding: 9px 14px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 12px; border: 1.5px solid var(--border); background: var(--card); color: var(--text-sub); outline: none; cursor: pointer; box-shadow: var(--shadow); }
.p-view-toggle { display: flex; gap: 3px; background: var(--card); border: 1.5px solid var(--border); border-radius: 99px; padding: 3px; box-shadow: var(--shadow); }
.p-view-btn { width: 30px; height: 30px; border-radius: 99px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-sub); transition: all 0.14s; }
.p-view-btn.active { background: var(--green); color: #fff; }

/* ── Bulk action bar ── */
.p-bulk-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: var(--green-pale); border-radius: var(--radius-sm); margin-bottom: 12px; border: 1.5px solid rgba(58,107,80,0.15); transition: opacity 0.2s; }
.p-bulk-bar span { font-size: 13px; font-weight: 600; color: var(--green); flex: 1; }

/* ── TABLE VIEW ── */
.p-table-card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); overflow: hidden; animation: pFadeUp 0.35s 0.1s ease both; }
.p-table-wrap { overflow-x: auto; }
.p-table-wrap table { width: 100%; border-collapse: collapse; }
.p-table-wrap thead tr { border-bottom: 1px solid var(--border); }
.p-table-wrap thead th { padding: 13px 16px; font-size: 10px; font-weight: 600; letter-spacing: 1.3px; text-transform: uppercase; color: var(--label); text-align: left; white-space: nowrap; background: rgba(242,239,224,0.5); }
.p-table-wrap thead th.right { text-align: right; }
.p-table-wrap thead th.center { text-align: center; }
.p-table-wrap tbody tr { border-bottom: 1px solid rgba(58,107,80,0.05); transition: background 0.13s; }
.p-table-wrap tbody tr:last-child { border-bottom: none; }
.p-table-wrap tbody tr:hover { background: rgba(58,107,80,0.025); }
.p-table-wrap tbody tr.selected { background: rgba(58,107,80,0.06); }
.p-table-wrap tbody td { padding: 12px 16px; font-size: 13px; vertical-align: middle; }
.p-table-wrap tbody td.right { text-align: right; }
.p-table-wrap tbody td.center { text-align: center; }

/* ── Product cell ── */
.p-prod-cell { display: flex; align-items: center; gap: 12px; }
.p-prod-img { width: 52px; height: 52px; border-radius: 10px; object-fit: cover; flex-shrink: 0; border: 1px solid var(--border); }
.p-prod-img-ph { width: 52px; height: 52px; border-radius: 10px; background: linear-gradient(135deg, var(--green-pale), rgba(58,107,80,0.15)); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.p-prod-name-btn { font-size: 13.5px; font-weight: 600; color: var(--green); background: none; border: none; font-family: 'DM Sans', sans-serif; cursor: pointer; padding: 0; text-align: left; transition: color 0.14s; display: block; }
.p-prod-name-btn:hover { color: var(--green-light); }
.p-prod-type { font-size: 11px; color: var(--text-sub); margin-top: 2px; text-transform: capitalize; }
.p-prod-sku { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--label); background: #F5F5F0; padding: 2px 6px; border-radius: 5px; margin-top: 3px; display: inline-block; }

/* ── Category badge ── */
.p-cat-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 99px; font-size: 11px; font-weight: 600; background: var(--green-pale); color: var(--green); white-space: nowrap; text-transform: capitalize; }

/* ── Price ── */
.p-price-cell { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600; color: var(--text); }
.p-price-mrp { font-size: 11px; color: var(--text-sub); text-decoration: line-through; margin-top: 2px; font-family: 'DM Mono', monospace; }
.p-discount-chip { font-size: 10px; font-weight: 600; background: #E6F4EC; color: var(--green); padding: 1px 6px; border-radius: 5px; margin-top: 2px; display: inline-block; }

/* ── Stock ── */
.p-stock-wrap { display: flex; flex-direction: column; gap: 3px; align-items: center; }
.p-stock-num { font-size: 13px; font-weight: 600; }
.p-stock-bar { width: 60px; height: 4px; background: rgba(58,107,80,0.12); border-radius: 99px; overflow: hidden; }
.p-stock-fill { height: 100%; border-radius: 99px; }

/* ── Status badge ── */
.p-status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
.p-status-badge::before { content: '●'; font-size: 7px; }
.p-sb-active { background: #E6F4EC; color: var(--green); }
.p-sb-draft { background: #F0F0EA; color: var(--label); }
.p-sb-out { background: var(--red-soft); color: var(--red); }

/* ── Row actions ── */
.p-row-actions { display: flex; gap: 5px; justify-content: flex-end; opacity: 0; transition: opacity 0.14s; }
.p-table-wrap tbody tr:hover .p-row-actions { opacity: 1; }
.p-row-btn { width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; color: var(--text-sub); }
.p-row-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-pale); }
.p-row-btn.danger:hover { border-color: var(--red); color: var(--red); background: var(--red-soft); }

/* ── GRID VIEW ── */
.p-grid-view { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; animation: pFadeUp 0.35s 0.1s ease both; }
.p-prod-card { background: var(--card); border-radius: var(--radius-sm); box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); overflow: hidden; transition: transform 0.18s, box-shadow 0.18s; cursor: pointer; }
.p-prod-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.p-prod-card-img { width: 100%; height: 180px; object-fit: cover; display: block; }
.p-prod-card-img-ph { width: 100%; height: 180px; background: linear-gradient(135deg, var(--green-pale) 0%, rgba(93,168,122,0.2) 100%); display: flex; align-items: center; justify-content: center; font-size: 48px; }
.p-prod-card-body { padding: 14px; }
.p-prod-card-name { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.3; }
.p-prod-card:hover .p-prod-card-name { color: var(--green); }
.p-prod-card-type { font-size: 11px; color: var(--text-sub); margin-top: 3px; text-transform: capitalize; }
.p-prod-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.p-prod-card-price { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 700; color: var(--green); }
.p-prod-card-actions { display: flex; gap: 5px; padding: 0 14px 14px; }

/* ── Pagination ── */
.p-pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
.p-page-info { font-size: 12px; color: var(--text-sub); }
.p-page-btns { display: flex; gap: 4px; }
.p-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card); font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: var(--text-sub); transition: all 0.13s; display: flex; align-items: center; justify-content: center; }
.p-page-btn:hover, .p-page-btn.active { background: var(--green); color: #fff; border-color: var(--green); }

/* ═══ PRODUCT DETAIL MODAL ═══ */
.p-overlay { position: fixed; inset: 0; background: rgba(15,25,15,0.38); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.22s; }
.p-overlay.open { opacity: 1; pointer-events: all; }
.p-modal { background: var(--card); border-radius: 26px; width: 100%; max-width: 680px; box-shadow: var(--shadow-lg); overflow: hidden; transform: translateY(24px) scale(0.97); transition: transform 0.26s cubic-bezier(.34,1.46,.64,1); max-height: 92vh; display: flex; flex-direction: column; }
.p-overlay.open .p-modal { transform: none; }
.p-modal-hero { display: grid; grid-template-columns: 200px 1fr; background: linear-gradient(135deg, #EAF4EE 0%, #F8F6EC 100%); border-bottom: 1px solid var(--border); position: relative; min-height: 200px; }
.p-modal-close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-sub); transition: all 0.15s; font-size: 14px; z-index: 1; }
.p-modal-close:hover { background: var(--green); color: #fff; border-color: var(--green); }
.p-modal-hero-img { width: 200px; height: 200px; object-fit: cover; display: block; }
.p-modal-hero-img-ph { width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 60px; background: linear-gradient(135deg, var(--green-pale), rgba(93,168,122,0.2)); }
.p-modal-hero-info { padding: 22px 52px 22px 22px; display: flex; flex-direction: column; justify-content: space-between; }
.p-modal-hero-cat { font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--label); margin-bottom: 6px; }
.p-modal-hero-name { font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.4px; line-height: 1.2; }
.p-modal-hero-sku { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-sub); margin-top: 5px; }
.p-modal-hero-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
.p-modal-hero-price { font-family: 'DM Mono', monospace; font-size: 28px; font-weight: 700; color: var(--green); letter-spacing: -1px; margin-top: 10px; }
.p-modal-hero-price-sub { font-size: 12px; color: var(--text-sub); font-family: 'DM Sans', sans-serif; margin-top: 2px; }
.p-modal-body { padding: 22px 26px; overflow-y: auto; flex: 1; }
.p-modal-section { margin-bottom: 22px; }
.p-modal-section-title { font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--label); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.p-modal-section-title::after { content:''; flex:1; height:1px; background: var(--border); }
.p-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.p-ms { background: #F9F8F3; border-radius: var(--radius-sm); padding: 13px 15px; border: 1px solid var(--border); }
.p-ms-label { font-size: 9px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--label); margin-bottom: 4px; }
.p-ms-val { font-size: 18px; font-weight: 700; color: var(--green); letter-spacing: -0.3px; }
.p-info-row { display: flex; align-items: flex-start; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(58,107,80,0.06); gap: 12px; }
.p-info-row:last-child { border-bottom: none; }
.p-info-key { font-size: 12px; color: var(--text-sub); font-weight: 500; flex-shrink: 0; }
.p-info-val { font-size: 13px; font-weight: 500; color: var(--text); text-align: right; }
.p-info-val.mono { font-family: 'DM Mono', monospace; }
.p-variant-group { display: flex; flex-wrap: wrap; gap: 6px; }
.p-variant-pill { padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 500; background: var(--green-pale); color: var(--green); border: 1.5px solid rgba(58,107,80,0.2); }
.p-desc-text { font-size: 13px; color: var(--text-sub); line-height: 1.6; }
.p-img-strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; }
.p-img-thumb { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; cursor: pointer; transition: border-color 0.14s; }
.p-img-thumb:hover, .p-img-thumb.active { border-color: var(--green); }
.p-img-thumb-ph { width: 64px; height: 64px; border-radius: 10px; background: var(--green-pale); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; border: 2px solid var(--border); }
.p-modal-footer { padding: 14px 26px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; align-items: center; }

/* ── Delete confirm ── */
.p-confirm-overlay { position: fixed; inset: 0; background: rgba(15,25,15,0.42); backdrop-filter: blur(6px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.18s; }
.p-confirm-overlay.open { opacity: 1; pointer-events: all; }
.p-confirm-box { background: var(--card); border-radius: 20px; padding: 30px; max-width: 380px; width: 100%; text-align: center; box-shadow: var(--shadow-lg); transform: scale(0.95); transition: transform 0.2s cubic-bezier(.34,1.46,.64,1); }
.p-confirm-overlay.open .p-confirm-box { transform: none; }
.p-confirm-icon { font-size: 40px; margin-bottom: 14px; }
.p-confirm-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.p-confirm-sub { font-size: 13px; color: var(--text-sub); line-height: 1.5; margin-bottom: 22px; }
.p-confirm-btns { display: flex; gap: 8px; justify-content: center; }

/* ── Animations ── */
@keyframes pFadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

@media (max-width: 960px) {
  .p-stats-strip { grid-template-columns: repeat(3, 1fr); }
  .p-modal-hero { grid-template-columns: 140px 1fr; }
  .p-modal-hero-img, .p-modal-hero-img-ph { width: 140px; height: 140px; }
  .p-stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .p-page { padding: 20px 14px 40px; }
  .p-stats-strip { grid-template-columns: 1fr 1fr; }
  .p-modal-hero { grid-template-columns: 1fr; }
  .p-filter-group { display: none; }
}
`;

function stockColor(s: number) { return s < 50 ? '#C0392B' : s < 100 ? '#B87620' : '#3A6B50'; }
function stockPct(s: number) { return Math.min(100, (s / 300) * 100); }
function stockFillColor(s: number) { return s < 50 ? 'var(--red)' : s < 100 ? 'var(--amber)' : 'var(--green)'; }
function discountPct(price: number, mrp: number) { if (!mrp || mrp <= price) return 0; return Math.round((1 - price / mrp) * 100); }
function fmtAmt(n: number) { return '₹' + (n || 0).toLocaleString('en-IN'); }

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name-asc');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/products?page=${page}&limit=50`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || data);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      });
  }, [page]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => { if (p.category) cats.add(p.category); });
    return Array.from(cats);
  }, [products]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.isActive !== false).length;
    const lowStock = products.filter(p => (p.stock || 0) < 50).length;
    const avgPrice = total > 0 ? Math.round(products.reduce((s, p) => s + (p.priceNew || 0), 0) / total) : 0;
    return { total, active, cats: categories.length, lowStock, avgPrice };
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    if (filter !== 'all') list = list.filter(p => p.category === filter);
    list.sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      if (sort === 'price-desc') return (b.priceNew || 0) - (a.priceNew || 0);
      if (sort === 'price-asc') return (a.priceNew || 0) - (b.priceNew || 0);
      if (sort === 'stock-desc') return (b.stock || 0) - (a.stock || 0);
      return 0;
    });
    return list;
  }, [products, search, filter, sort]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = async (product: any) => {
    try {
      await fetch(`/api/products/${product._id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== product._id));
      setDeleteTarget(null);
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ padding: '40px', fontFamily: 'DM Sans, sans-serif', color: '#7A8070' }}>
      Loading products...
    </div>
  );

  return (
    <div className="p-page">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Header */}
      <div className="p-header">
        <div>
          <h1>All Products</h1>
          <p>Premium product management</p>
        </div>
        <div className="p-header-actions">
          <Link href="/admin/products/upload" className="p-btn p-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Bulk Upload
          </Link>
          <button className="p-btn p-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export
          </button>
          <Link href="/admin/products/add" className="p-btn p-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="p-stats-strip">
        <div className="p-stat-card">
          <div className="p-s-label">Total Products</div>
          <div className="p-s-val">{stats.total}</div>
          <div className="p-s-badge up">↑ Live from DB</div>
        </div>
        <div className="p-stat-card">
          <div className="p-s-label">Active</div>
          <div className="p-s-val">{stats.active}</div>
          <div className="p-s-badge up">All live</div>
        </div>
        <div className="p-stat-card">
          <div className="p-s-label">Categories</div>
          <div className="p-s-val">{stats.cats}</div>
          <div className="p-s-badge neutral">— stable</div>
        </div>
        <div className="p-stat-card">
          <div className="p-s-label">Low Stock</div>
          <div className={`p-s-val${stats.lowStock > 0 ? ' amber' : ''}`}>{stats.lowStock}</div>
          <div className={`p-s-badge${stats.lowStock > 0 ? ' warn' : ' neutral'}`}>
            {stats.lowStock > 0 ? 'Monitor weekly' : '— all stocked'}
          </div>
        </div>
        <div className="p-stat-card">
          <div className="p-s-label">Avg Price</div>
          <div className="p-s-val">{fmtAmt(stats.avgPrice)}</div>
          <div className="p-s-badge up">Per product</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-toolbar">
        <div className="p-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" placeholder="Search products, category…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="p-filter-group">
          <button className={`p-filter-pill${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
          {categories.map(cat => (
            <button key={cat} className={`p-filter-pill${filter === cat ? ' active' : ''}`} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <select className="p-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name-asc">Sort: A → Z</option>
          <option value="name-desc">Sort: Z → A</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="stock-desc">Stock: High → Low</option>
        </select>
        <div className="p-view-toggle">
          <button className={`p-view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')} title="List view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
          </button>
          <button className={`p-view-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')} title="Grid view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </button>
        </div>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="p-bulk-bar">
          <span>{selected.size} product{selected.size !== 1 ? 's' : ''} selected</span>
          <button className="p-btn p-btn-ghost" style={{ padding: '6px 14px', fontSize: '12px' }}>Edit Category</button>
          <button className="p-btn p-btn-danger" style={{ padding: '6px 14px', fontSize: '12px' }}>Delete Selected</button>
          <button className="p-btn p-btn-ghost" style={{ padding: '6px 14px', fontSize: '12px', marginLeft: 'auto' }} onClick={() => setSelected(new Set())}>✕ Clear</button>
        </div>
      )}

      {/* TABLE VIEW */}
      {view === 'list' && (
        <div className="p-table-card">
          <div className="p-table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input type="checkbox" onChange={e => {
                      if (e.target.checked) setSelected(new Set(filteredProducts.map(p => p._id)));
                      else setSelected(new Set());
                    }} />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="right">Price</th>
                  <th className="center">Stock</th>
                  <th className="center">Status</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const disc = discountPct(p.priceNew, p.priceOld);
                  const stock = p.stock || 0;
                  return (
                    <tr key={p._id} className={selected.has(p._id) ? 'selected' : ''}>
                      <td><input type="checkbox" checked={selected.has(p._id)} onChange={() => toggleSelect(p._id)} /></td>
                      <td>
                        <div className="p-prod-cell">
                          {p.mainImage
                            ? <img src={p.mainImage} alt={p.name} className="p-prod-img" />
                            : <div className="p-prod-img-ph">👗</div>
                          }
                          <div>
                            <button className="p-prod-name-btn" onClick={() => setSelectedProduct(p)}>{p.name}</button>
                            <div className="p-prod-type">{p.type || p.category}</div>
                            <div className="p-prod-sku">{p._id.slice(-8).toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="p-cat-badge">{p.category}</span></td>
                      <td className="right">
                        <div className="p-price-cell">{fmtAmt(p.priceNew)}</div>
                        {p.priceOld && <div className="p-price-mrp">{fmtAmt(p.priceOld)}</div>}
                        {disc > 0 && <div className="p-discount-chip">{disc}% off</div>}
                      </td>
                      <td className="center">
                        <div className="p-stock-wrap">
                          <div className="p-stock-num" style={{ color: stockColor(stock) }}>{stock}</div>
                          <div className="p-stock-bar">
                            <div className="p-stock-fill" style={{ width: `${stockPct(stock)}%`, background: stockFillColor(stock) }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="center">
                        <span className={`p-status-badge ${stock === 0 ? 'p-sb-out' : 'p-sb-active'}`}>
                          {stock === 0 ? 'Out of Stock' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="p-row-actions">
                          <button className="p-row-btn" title="View" onClick={() => setSelectedProduct(p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          </button>
                          <button className="p-row-btn" title="Edit" onClick={() => router.push(`/admin/products/${p._id}/edit`)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </button>
                          <button className="p-row-btn danger" title="Delete" onClick={() => setDeleteTarget(p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-pagination">
            <div className="p-page-info">Showing {filteredProducts.length} of {products.length} products</div>
            <div className="p-page-btns">
              <button className="p-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`p-page-btn${page === i + 1 ? ' active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button className="p-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
            </div>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {view === 'grid' && (
        <div className="p-grid-view">
          {filteredProducts.map(p => {
            const disc = discountPct(p.priceNew, p.priceOld);
            const stock = p.stock || 0;
            return (
              <div key={p._id} className="p-prod-card" onClick={() => setSelectedProduct(p)}>
                {p.mainImage
                  ? <img src={p.mainImage} alt={p.name} className="p-prod-card-img" />
                  : <div className="p-prod-card-img-ph">👗</div>
                }
                <div className="p-prod-card-body">
                  <div className="p-prod-card-name">{p.name}</div>
                  <div className="p-prod-card-type">{p.category}</div>
                  <div className="p-prod-card-footer">
                    <div>
                      <div className="p-prod-card-price">{fmtAmt(p.priceNew)}</div>
                      {disc > 0 && <div style={{ fontSize: '10px', color: 'var(--green)', marginTop: '1px' }}>{disc}% off MRP</div>}
                    </div>
                    <div style={{ fontSize: '11px', color: stockColor(stock) }}>📦 {stock}</div>
                  </div>
                </div>
                <div className="p-prod-card-actions" onClick={e => e.stopPropagation()}>
                  <button className="p-btn p-btn-ghost" style={{ padding: '5px 12px', fontSize: '11px', flex: 1, borderRadius: '8px' }} onClick={() => router.push(`/admin/products/${p._id}/edit`)}>Edit</button>
                  <button className="p-btn p-btn-danger" style={{ padding: '5px 12px', fontSize: '11px', borderRadius: '8px' }} onClick={() => setDeleteTarget(p)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      <div className={`p-overlay${selectedProduct ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
        {selectedProduct && (
          <div className="p-modal">
            <div className="p-modal-hero">
              <button className="p-modal-close" onClick={() => setSelectedProduct(null)}>✕</button>
              {selectedProduct.mainImage
                ? <img src={selectedProduct.mainImage} alt={selectedProduct.name} className="p-modal-hero-img" />
                : <div className="p-modal-hero-img-ph">👗</div>
              }
              <div className="p-modal-hero-info">
                <div>
                  <div className="p-modal-hero-cat">{selectedProduct.category}</div>
                  <div className="p-modal-hero-name">{selectedProduct.name}</div>
                  <div className="p-modal-hero-sku">{selectedProduct._id.slice(-8).toUpperCase()}</div>
                  <div className="p-modal-hero-badges">
                    <span className={`p-status-badge ${(selectedProduct.stock || 0) === 0 ? 'p-sb-out' : 'p-sb-active'}`}>
                      {(selectedProduct.stock || 0) === 0 ? 'Out of Stock' : 'Active'}
                    </span>
                    <span className="p-cat-badge">{selectedProduct.type || selectedProduct.category}</span>
                  </div>
                </div>
                <div>
                  <div className="p-modal-hero-price">{fmtAmt(selectedProduct.priceNew)}</div>
                  {selectedProduct.priceOld && (
                    <div className="p-modal-hero-price-sub">
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-sub)' }}>{fmtAmt(selectedProduct.priceOld)}</span>
                      {discountPct(selectedProduct.priceNew, selectedProduct.priceOld) > 0 && (
                        <span style={{ color: 'var(--green)', fontWeight: 600, marginLeft: '6px' }}>{discountPct(selectedProduct.priceNew, selectedProduct.priceOld)}% off</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-modal-body">
              <div className="p-modal-section">
                <div className="p-modal-section-title">Inventory Overview</div>
                <div className="p-stats-grid">
                  <div className="p-ms"><div className="p-ms-label">Stock</div><div className="p-ms-val" style={{ color: stockColor(selectedProduct.stock || 0) }}>{selectedProduct.stock || 0}</div></div>
                  <div className="p-ms"><div className="p-ms-label">Category</div><div className="p-ms-val" style={{ fontSize: '14px' }}>{selectedProduct.category}</div></div>
                  <div className="p-ms"><div className="p-ms-label">Price</div><div className="p-ms-val">{fmtAmt(selectedProduct.priceNew)}</div></div>
                  <div className="p-ms"><div className="p-ms-label">Discount</div><div className="p-ms-val">{discountPct(selectedProduct.priceNew, selectedProduct.priceOld)}%</div></div>
                </div>
              </div>
              <div className="p-modal-section">
                <div className="p-modal-section-title">Product Details</div>
                <div className="p-info-row"><span className="p-info-key">Product ID</span><span className="p-info-val mono">{selectedProduct._id.slice(-8).toUpperCase()}</span></div>
                <div className="p-info-row"><span className="p-info-key">Category</span><span className="p-info-val">{selectedProduct.category}</span></div>
                {selectedProduct.type && <div className="p-info-row"><span className="p-info-key">Type</span><span className="p-info-val">{selectedProduct.type}</span></div>}
                <div className="p-info-row"><span className="p-info-key">Selling Price</span><span className="p-info-val mono">{fmtAmt(selectedProduct.priceNew)}</span></div>
                {selectedProduct.priceOld && <div className="p-info-row"><span className="p-info-key">MRP</span><span className="p-info-val mono">{fmtAmt(selectedProduct.priceOld)}</span></div>}
                <div className="p-info-row"><span className="p-info-key">Stock</span><span className="p-info-val">{selectedProduct.stock || 0}</span></div>
              </div>
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="p-modal-section">
                  <div className="p-modal-section-title">Sizes Available</div>
                  <div className="p-variant-group">
                    {selectedProduct.sizes.map((s: any, i: number) => {
                      const label = typeof s === 'object' ? (s.size || JSON.stringify(s)) : s;
                      return <span key={`size-${i}`} className="p-variant-pill">{label}</span>;
                    })}
                  </div>
                </div>
              )}
              {selectedProduct.description && (
                <div className="p-modal-section">
                  <div className="p-modal-section-title">Description</div>
                  <div className="p-desc-text">{selectedProduct.description}</div>
                </div>
              )}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="p-modal-section">
                  <div className="p-modal-section-title">Gallery</div>
                  <div className="p-img-strip">
                    {selectedProduct.images.map((img: string, i: number) => (
                      <img key={i} src={img} alt="" className={`p-img-thumb${i === 0 ? ' active' : ''}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-modal-footer">
              <button className="p-btn p-btn-ghost" onClick={() => setSelectedProduct(null)}>Close</button>
              <button className="p-btn p-btn-danger" style={{ padding: '9px 16px' }} onClick={() => { setSelectedProduct(null); setDeleteTarget(selectedProduct); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                Delete
              </button>
              <button className="p-btn p-btn-primary" onClick={() => router.push(`/admin/products/${selectedProduct._id}/edit`)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit Product
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <div className={`p-confirm-overlay${deleteTarget ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
        {deleteTarget && (
          <div className="p-confirm-box">
            <div className="p-confirm-icon">🗑️</div>
            <div className="p-confirm-title">Delete Product?</div>
            <div className="p-confirm-sub">Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.</div>
            <div className="p-confirm-btns">
              <button className="p-btn p-btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="p-btn p-btn-danger" style={{ background: 'var(--red)', color: '#fff', border: 'none' }} onClick={() => handleDelete(deleteTarget)}>
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
