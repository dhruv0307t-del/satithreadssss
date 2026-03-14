"use client";

import { useEffect, useState, useMemo, useRef } from "react";
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
  --shadow-lg: 0 12px 48px rgba(40,60,40,0.14), 0 4px 12px rgba(40,60,40,0.08);
  --red: #C0392B;
  --red-soft: #FDECEA;
  --radius: 20px;
  --radius-sm: 12px;
}

/* ── Page ── */
.u-page { width: 100%; padding: 40px 32px 60px; font-family: 'DM Sans', sans-serif; color: var(--text); }

/* ── Header ── */
.u-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.u-header h1 { font-size: 36px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
.u-header p { font-size: 13px; color: var(--text-sub); margin-top: 4px; }
.u-header-actions { display: flex; gap: 10px; align-items: center; }

.u-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 99px; font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.17s;
}
.u-btn-primary { background: var(--green); color: #fff; }
.u-btn-primary:hover { background: #2e5640; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(58,107,80,0.3); }
.u-btn-ghost { background: var(--card); color: var(--text-sub); border: 1.5px solid var(--border); }
.u-btn-ghost:hover { border-color: var(--green); color: var(--green); }

/* ── Stats strip ── */
.u-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; animation: uFadeUp 0.35s ease both; }
.u-stat-card { background: var(--card); border-radius: var(--radius-sm); padding: 16px 18px; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); }
.u-stat-card .s-label { font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--label); margin-bottom: 6px; }
.u-stat-card .s-val { font-size: 26px; font-weight: 700; color: var(--green); letter-spacing: -0.5px; }
.u-stat-card .s-badge { display: inline-flex; align-items: center; gap: 3px; margin-top: 5px; font-size: 11px; font-weight: 500; padding: 2px 7px; border-radius: 99px; background: #E6F4EC; color: var(--green); }

/* ── Toolbar ── */
.u-toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; animation: uFadeUp 0.35s 0.05s ease both; }
.u-search-wrap { position: relative; flex: 1; min-width: 220px; }
.u-search-wrap input {
  width: 100%; padding: 10px 14px 10px 38px; border-radius: 99px;
  border: 1.5px solid var(--border); background: var(--card);
  font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text);
  outline: none; transition: border-color 0.17s;
}
.u-search-wrap input:focus { border-color: var(--green); }
.u-search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); opacity: 0.4; pointer-events: none; }
.u-filter-group { display: flex; gap: 6px; }
.u-filter-pill {
  padding: 8px 14px; border-radius: 99px; font-size: 12px; font-weight: 500;
  cursor: pointer; border: 1.5px solid var(--border); background: var(--card);
  color: var(--text-sub); transition: all 0.15s; font-family: 'DM Sans', sans-serif;
}
.u-filter-pill:hover { border-color: var(--green); color: var(--green); }
.u-filter-pill.active { background: var(--green); color: #fff; border-color: var(--green); }
.u-sort-select {
  padding: 9px 14px; border-radius: 99px; font-family: 'DM Sans', sans-serif;
  font-size: 12px; border: 1.5px solid var(--border); background: var(--card);
  color: var(--text-sub); outline: none; cursor: pointer;
}
.u-sort-select:focus { border-color: var(--green); }

/* ── Table card ── */
.u-table-card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); overflow: hidden; animation: uFadeUp 0.35s 0.1s ease both; }
.u-table-wrap { overflow-x: auto; }
.u-table-wrap table { width: 100%; border-collapse: collapse; }
.u-table-wrap thead tr { border-bottom: 1px solid var(--border); }
.u-table-wrap thead th {
  padding: 14px 20px; font-size: 10px; font-weight: 600; letter-spacing: 1.3px;
  text-transform: uppercase; color: var(--label); text-align: left; white-space: nowrap;
  background: rgba(242,239,224,0.4);
}
.u-table-wrap thead th.num { text-align: right; }
.u-table-wrap tbody tr { border-bottom: 1px solid rgba(58,107,80,0.05); transition: background 0.14s; cursor: default; }
.u-table-wrap tbody tr:last-child { border-bottom: none; }
.u-table-wrap tbody tr:hover { background: rgba(58,107,80,0.03); }
.u-table-wrap tbody td { padding: 14px 20px; font-size: 13.5px; vertical-align: middle; }
.u-table-wrap tbody td.num { text-align: right; font-family: 'DM Mono', monospace; font-size: 13px; }

/* ── Avatar ── */
.user-cell { display: flex; align-items: center; gap: 12px; }
.u-avatar {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff; letter-spacing: 0.5px;
}
.user-name-btn {
  font-size: 13.5px; font-weight: 600; color: var(--green); cursor: pointer;
  background: none; border: none; font-family: 'DM Sans', sans-serif;
  padding: 0; text-align: left; transition: color 0.15s; text-decoration: none;
  display: flex; align-items: center; gap: 4px;
}
.user-name-btn:hover { color: var(--green-light); }
.user-name-btn::after { content: '↗'; font-size: 10px; opacity: 0; transition: opacity 0.15s; }
.user-name-btn:hover::after { opacity: 1; }
.user-sub { font-size: 11px; color: var(--text-sub); margin-top: 1px; }

/* ── Email ── */
.email-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-sub); font-family: 'DM Mono', monospace; }

/* ── Badges ── */
.u-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 500; white-space: nowrap; }
.u-badge-yes { background: var(--green-pale); color: var(--green); }
.u-badge-no { background: #F5F5F0; color: #9A9E90; }
.u-badge-active { background: #E6F4EC; color: var(--green); }
.u-badge-inactive { background: #F5F5F0; color: #9A9E90; }
.u-badge-vip { background: #FEF3E2; color: #C07A20; }

.orders-val { color: var(--text); font-weight: 500; }
.orders-val.zero { color: #C0C4B8; }
.spent-val { color: var(--green); font-weight: 600; }
.spent-val.zero { color: #C0C4B8; font-weight: 400; }

/* ── Row actions ── */
.row-actions { display: flex; gap: 6px; opacity: 0; transition: opacity 0.15s; justify-content: flex-end; }
.u-table-wrap tbody tr:hover .row-actions { opacity: 1; }
.row-btn {
  width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border);
  background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.14s; color: var(--text-sub);
}
.row-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-pale); }
.row-btn.danger:hover { border-color: var(--red); color: var(--red); background: var(--red-soft); }

/* ── Pagination ── */
.u-pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
.u-page-info { font-size: 12px; color: var(--text-sub); }
.u-page-btns { display: flex; gap: 4px; }
.u-page-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border);
  background: var(--card); font-size: 12px; font-weight: 500; cursor: pointer;
  font-family: 'DM Sans', sans-serif; color: var(--text-sub); transition: all 0.14s;
  display: flex; align-items: center; justify-content: center;
}
.u-page-btn:hover, .u-page-btn.active { background: var(--green); color: #fff; border-color: var(--green); }

/* ── Animations ── */
@keyframes uFadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:translateY(0); } }

/* ═══ MODAL ═══ */
.u-overlay {
  position: fixed; inset: 0; background: rgba(20,30,20,0.35);
  backdrop-filter: blur(4px); z-index: 9999;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  opacity: 0; pointer-events: none; transition: opacity 0.22s;
}
.u-overlay.open { opacity: 1; pointer-events: all; }
.u-modal {
  background: var(--card); border-radius: 24px; width: 100%; max-width: 560px;
  box-shadow: var(--shadow-lg); overflow: hidden;
  transform: translateY(20px) scale(0.97); transition: transform 0.25s cubic-bezier(.34,1.46,.64,1);
  max-height: 90vh; display: flex; flex-direction: column;
}
.u-overlay.open .u-modal { transform: translateY(0) scale(1); }
.u-modal-hero {
  padding: 28px 28px 20px;
  background: linear-gradient(135deg, #EAF4EE 0%, #F8F6EC 100%);
  border-bottom: 1px solid var(--border); position: relative;
}
.u-modal-close {
  position: absolute; top: 16px; right: 16px;
  width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border);
  background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--text-sub); transition: all 0.15s; font-size: 16px; line-height: 1;
}
.u-modal-close:hover { background: var(--green); color: #fff; border-color: var(--green); }
.u-modal-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.u-modal-name { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; color: var(--text); }
.u-modal-email { font-size: 13px; color: var(--text-sub); margin-top: 3px; font-family: 'DM Mono', monospace; }
.u-modal-badges { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
.u-modal-body { padding: 24px 28px; overflow-y: auto; flex: 1; }
.u-modal-section { margin-bottom: 22px; }
.u-modal-section-title {
  font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase;
  color: var(--label); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}
.u-modal-section-title::after { content:''; flex:1; height:1px; background: var(--border); }
.u-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.u-modal-stat { background: #F9F8F3; border-radius: var(--radius-sm); padding: 14px 16px; border: 1px solid var(--border); }
.u-modal-stat .ms-label { font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--label); margin-bottom: 4px; }
.u-modal-stat .ms-val { font-size: 20px; font-weight: 700; color: var(--green); letter-spacing: -0.5px; }
.u-modal-stat .ms-val.zero { color: #C0C4B8; }
.u-modal-stat .ms-sub { font-size: 11px; color: var(--text-sub); margin-top: 2px; }
.u-info-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(58,107,80,0.06); }
.u-info-row:last-child { border-bottom: none; }
.u-info-key { font-size: 12px; color: var(--text-sub); font-weight: 500; }
.u-info-val { font-size: 13px; font-weight: 500; color: var(--text); font-family: 'DM Mono', monospace; }
.u-order-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; background: #F9F8F3; margin-bottom: 6px; border: 1px solid var(--border); }
.u-order-row:last-child { margin-bottom: 0; }
.u-order-id { font-size: 11px; font-family: 'DM Mono', monospace; color: var(--text-sub); }
.u-order-date { font-size: 11px; color: var(--text-sub); }
.u-order-amt { font-size: 13px; font-weight: 600; color: var(--green); }
.u-order-status { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 99px; }
.os-delivered { background: #E6F4EC; color: var(--green); }
.os-pending { background: #FEF3E2; color: #C07A20; }
.os-cancelled { background: var(--red-soft); color: var(--red); }
.u-modal-footer { padding: 16px 28px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }

@media (max-width: 700px) {
  .u-page { padding: 20px 14px 40px; }
  .u-stats-strip { grid-template-columns: 1fr 1fr; }
  .u-modal-grid { grid-template-columns: 1fr; }
  .u-filter-group { display: none; }
}
`;

const avatarColors = ['#3A6B50', '#5D6B9B', '#9B5D6B', '#6B9B5D', '#9B7A3A', '#3A6B8C'];

function initials(name: string) {
  if (!name) return 'U';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function fmt(n: number) {
  if (!n || n === 0) return '₹0';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
  return '₹' + n.toLocaleString('en-IN');
}

export default function UsersPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('joined');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportFrom, setExportFrom] = useState('');
  const [exportTo, setExportTo] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    }
    if (showExport) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showExport]);

  function handleExportUsers() {
    const params = new URLSearchParams();
    if (exportFrom) params.set('from', exportFrom);
    if (exportTo) params.set('to', exportTo);
    window.location.href = `/api/admin/export/users?${params.toString()}`;
    setShowExport(false);
  }

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    let list = [...data.users];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    if (filter === 'active') list = list.filter(u => u.totalOrders > 0);
    if (filter === 'subscribed') list = list.filter(u => u.isSubscribed);
    if (filter === 'new') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(u => new Date(u.createdAt) >= weekAgo);
    }
    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'orders') return b.totalOrders - a.totalOrders;
      if (sort === 'spent') return b.totalSpent - a.totalSpent;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [data, search, filter, sort]);

  if (loading) return (
    <div style={{ padding: '40px', fontFamily: 'DM Sans, sans-serif', color: '#7A8070' }}>
      Loading users...
    </div>
  );

  const userIdx = selectedUser ? data.users.indexOf(selectedUser) : 0;

  return (
    <div className="u-page">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Header */}
      <div className="u-header">
        <div>
          <h1>Users</h1>
          <p>Manage and view all registered customers · Total {data.stats.totalUsers}</p>
        </div>
        <div className="u-header-actions" style={{ position: 'relative' }} ref={exportRef}>
          <button className="u-btn u-btn-ghost" onClick={() => setShowExport(!showExport)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export CSV
          </button>
          {showExport && (
            <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 200, background: '#fff', borderRadius: 18, boxShadow: '0 12px 48px rgba(40,60,40,0.16)', border: '1px solid rgba(58,107,80,0.12)', padding: '20px 22px', minWidth: 280 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#1A1A14' }}>Export Users to CSV</div>
              <div style={{ fontSize: 12, color: '#7A8070', marginBottom: 6 }}>Date Range (optional)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#7A8070', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.8px' }}>From</div>
                  <input type="date" value={exportFrom} onChange={e => setExportFrom(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1.5px solid rgba(58,107,80,0.15)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, outline: 'none', background: '#F9F8F3' }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#7A8070', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.8px' }}>To</div>
                  <input type="date" value={exportTo} onChange={e => setExportTo(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1.5px solid rgba(58,107,80,0.15)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, outline: 'none', background: '#F9F8F3' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setExportFrom(''); setExportTo(''); }} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1.5px solid rgba(58,107,80,0.15)', background: '#F9F8F3', fontFamily: 'DM Sans, sans-serif', fontSize: 12, cursor: 'pointer', color: '#7A8070' }}>Clear</button>
                <button onClick={handleExportUsers} style={{ flex: 2, padding: '9px', borderRadius: 10, border: 'none', background: '#3A6B50', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Download CSV
                </button>
              </div>
              <div style={{ fontSize: 10, color: '#9A9E90', marginTop: 10, textAlign: 'center' }}>Leave dates empty to export all users</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="u-stats-strip">
        <div className="u-stat-card">
          <div className="s-label">Total Users</div>
          <div className="s-val">{data.stats.totalUsers}</div>
          <div className="s-badge">↑ {data.stats.newUsersThisWeek} this week</div>
        </div>
        <div className="u-stat-card">
          <div className="s-label">Active Buyers</div>
          <div className="s-val">{data.stats.activeBuyers}</div>
          <div className="s-badge" style={data.stats.activeBuyers === 0 ? { background: '#F5F5F0', color: '#9A9E90' } : {}}>
            {data.stats.activeBuyers > 0 ? '↑ Active this month' : '— no change'}
          </div>
        </div>
        <div className="u-stat-card">
          <div className="s-label">Subscribed</div>
          <div className="s-val">{data.stats.subscribedCount}</div>
          <div className="s-badge" style={data.stats.subscribedCount === 0 ? { background: '#F5F5F0', color: '#9A9E90' } : {}}>
            {data.stats.subscribedCount === 0 ? '— no change' : 'Newsletter'}
          </div>
        </div>
        <div className="u-stat-card">
          <div className="s-label">Avg Spend</div>
          <div className="s-val">{fmt(data.stats.avgSpend)}</div>
          <div className="s-badge">Per active buyer</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="u-toolbar">
        <div className="u-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Search by name, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="u-filter-group">
          {['all', 'active', 'subscribed', 'new'].map(f => (
            <button
              key={f}
              className={`u-filter-pill${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active Buyers' : f === 'subscribed' ? 'Subscribed' : 'New'}
            </button>
          ))}
        </div>
        <select className="u-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="joined">Sort: Joined</option>
          <option value="name">Sort: Name</option>
          <option value="orders">Sort: Orders</option>
          <option value="spent">Sort: Spent</option>
        </select>
      </div>

      {/* Table */}
      <div className="u-table-card">
        <div className="u-table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th className="num">Orders</th>
                <th className="num">Total Spent</th>
                <th>Subscribed</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u: any, i: number) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div className="u-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <button className="user-name-btn" onClick={() => setSelectedUser(u)}>
                          {u.name || 'Unknown'}
                        </button>
                        <div className="user-sub">{u._id.slice(-8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-chip">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      {u.email}
                    </div>
                  </td>
                  <td className="num">
                    <span className={`orders-val${u.totalOrders === 0 ? ' zero' : ''}`}>{u.totalOrders}</span>
                  </td>
                  <td className="num">
                    <span className={`spent-val${u.totalSpent === 0 ? ' zero' : ''}`}>{fmt(u.totalSpent)}</span>
                  </td>
                  <td>
                    <span className={`u-badge ${u.isSubscribed ? 'u-badge-yes' : 'u-badge-no'}`}>
                      {u.isSubscribed ? '✓ Yes' : '✕ No'}
                    </span>
                  </td>
                  <td>
                    <span className={`u-badge ${u.totalOrders > 0 ? 'u-badge-active' : 'u-badge-inactive'}`}>
                      {u.totalOrders > 0 ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="row-btn" title="View" onClick={() => setSelectedUser(u)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                      <button className="row-btn" title="Edit" onClick={() => router.push(`/admin/users/${u._id}`)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className="row-btn danger" title="Delete">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="u-pagination">
          <div className="u-page-info">Showing {filteredUsers.length} of {data.users.length} users</div>
          <div className="u-page-btns">
            <button className="u-page-btn">‹</button>
            <button className="u-page-btn active">1</button>
            <button className="u-page-btn">›</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`u-overlay${selectedUser ? ' open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setSelectedUser(null); }}
      >
        {selectedUser && (
          <div className="u-modal">
            <div className="u-modal-hero">
              <button className="u-modal-close" onClick={() => setSelectedUser(null)}>✕</button>
              <div className="u-modal-avatar" style={{ background: avatarColors[userIdx % avatarColors.length] }}>
                {initials(selectedUser.name)}
              </div>
              <div className="u-modal-name">{selectedUser.name || 'Unknown'}</div>
              <div className="u-modal-email">{selectedUser.email}</div>
              <div className="u-modal-badges">
                <span className={`u-badge ${selectedUser.totalOrders > 0 ? 'u-badge-active' : 'u-badge-inactive'}`}>
                  {selectedUser.totalOrders > 0 ? '● Active' : '● Inactive'}
                </span>
                <span className={`u-badge ${selectedUser.isSubscribed ? 'u-badge-yes' : 'u-badge-no'}`}>
                  {selectedUser.isSubscribed ? '✓ Subscribed' : '✕ Not Subscribed'}
                </span>
                {selectedUser.totalOrders >= 3 && <span className="u-badge u-badge-vip">★ VIP</span>}
              </div>
            </div>
            <div className="u-modal-body">
              {/* Stats */}
              <div className="u-modal-section">
                <div className="u-modal-section-title">Overview</div>
                <div className="u-modal-grid">
                  <div className="u-modal-stat">
                    <div className="ms-label">Total Orders</div>
                    <div className={`ms-val${selectedUser.totalOrders === 0 ? ' zero' : ''}`}>{selectedUser.totalOrders}</div>
                    <div className="ms-sub">Lifetime orders placed</div>
                  </div>
                  <div className="u-modal-stat">
                    <div className="ms-label">Total Spent</div>
                    <div className={`ms-val${selectedUser.totalSpent === 0 ? ' zero' : ''}`}>{fmt(selectedUser.totalSpent)}</div>
                    <div className="ms-sub">Lifetime value</div>
                  </div>
                  <div className="u-modal-stat">
                    <div className="ms-label">Avg Order Value</div>
                    <div className={`ms-val${selectedUser.totalOrders === 0 ? ' zero' : ''}`}>
                      {selectedUser.totalOrders > 0 ? fmt(Math.round(selectedUser.totalSpent / selectedUser.totalOrders)) : '₹0'}
                    </div>
                    <div className="ms-sub">Per order average</div>
                  </div>
                  <div className="u-modal-stat">
                    <div className="ms-label">Location</div>
                    <div className="ms-val" style={{ fontSize: '15px', letterSpacing: 0 }}>{selectedUser.location || '—'}</div>
                    <div className="ms-sub">From latest order</div>
                  </div>
                </div>
              </div>
              {/* Details */}
              <div className="u-modal-section">
                <div className="u-modal-section-title">Account Details</div>
                <div className="u-info-row"><span className="u-info-key">User ID</span><span className="u-info-val">{selectedUser._id.slice(-8).toUpperCase()}</span></div>
                <div className="u-info-row"><span className="u-info-key">Phone</span><span className="u-info-val">{selectedUser.phone || '—'}</span></div>
                <div className="u-info-row"><span className="u-info-key">Joined</span><span className="u-info-val">{new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
                <div className="u-info-row"><span className="u-info-key">Newsletter</span><span className="u-info-val">{selectedUser.isSubscribed ? 'Subscribed' : 'Not subscribed'}</span></div>
              </div>
              {/* Saved Addresses */}
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div className="u-modal-section">
                  <div className="u-modal-section-title">Saved Addresses</div>
                  {selectedUser.addresses.map((addr: any, idx: number) => (
                    <div key={idx} style={{ padding: '12px', background: '#F9F8F3', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{addr.name} {addr.isDefault && <span style={{ color: 'var(--green)', fontSize: '10px' }}>(Default)</span>}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{addr.phone}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: '1.4' }}>
                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Orders */}
              <div className="u-modal-section">
                <div className="u-modal-section-title">Order History</div>
                {(!selectedUser.orderHistory || selectedUser.orderHistory.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-sub)', fontSize: '13px' }}>No orders yet</div>
                ) : (
                  selectedUser.orderHistory.map((o: any) => (
                    <div key={o.id} className="u-order-row">
                      <div>
                        <div className="u-order-id">{String(o.id).slice(-8).toUpperCase()}</div>
                        <div className="u-order-date">{new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="u-order-amt">{fmt(o.amount)}</span>
                        <span className={`u-order-status os-${o.status || 'pending'}`}>
                          {o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="u-modal-footer">
              <button className="u-btn u-btn-ghost" onClick={() => setSelectedUser(null)}>Close</button>
              <button className="u-btn u-btn-primary" onClick={() => router.push(`/admin/users/${selectedUser._id}`)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
