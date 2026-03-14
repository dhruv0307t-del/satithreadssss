"use client";

import { useEffect, useState, useMemo, useRef } from "react";

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
  --blue: #2C6E8A;
  --blue-soft: #E8F4FA;
  --radius: 20px;
  --radius-sm: 12px;
}

/* ── Page ── */
.o-page { width: 100%; padding: 40px 32px 60px; font-family: 'DM Sans', sans-serif; color: var(--text); }

/* ── Header ── */
.o-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
.o-header h1 { font-size: 36px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
.o-header p { font-size: 13px; color: var(--text-sub); margin-top: 4px; }
.o-header-actions { display: flex; gap: 10px; }
.o-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.17s; }
.o-btn-primary { background: var(--green); color: #fff; }
.o-btn-primary:hover { background: #2e5640; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(58,107,80,0.3); }
.o-btn-ghost { background: var(--card); color: var(--text-sub); border: 1.5px solid var(--border); }
.o-btn-ghost:hover { border-color: var(--green); color: var(--green); }

/* ── Stats strip ── */
.o-stats-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; animation: oFadeUp 0.35s ease both; }
.o-stat-card { background: var(--card); border-radius: var(--radius-sm); padding: 16px 18px; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); transition: transform 0.18s, box-shadow 0.18s; }
.o-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.o-stat-card .s-label { font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--label); margin-bottom: 7px; }
.o-stat-card .s-val { font-size: 26px; font-weight: 700; color: var(--green); letter-spacing: -0.5px; line-height: 1; }
.o-stat-card .s-val.danger { color: var(--red); }
.o-stat-card .s-val.amber { color: var(--amber); }
.o-stat-card .s-badge { display: inline-flex; align-items: center; gap: 3px; margin-top: 6px; font-size: 11px; font-weight: 500; padding: 2px 7px; border-radius: 99px; }
.s-badge.up { background: #E6F4EC; color: var(--green); }
.s-badge.warn { background: var(--amber-soft); color: var(--amber); }
.s-badge.neutral { background: #F0F0EA; color: var(--label); }

/* ── Toolbar ── */
.o-toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; animation: oFadeUp 0.35s 0.05s ease both; }
.o-search-wrap { position: relative; flex: 1; min-width: 220px; }
.o-search-wrap input { width: 100%; padding: 10px 14px 10px 38px; border-radius: 99px; border: 1.5px solid var(--border); background: var(--card); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.17s; }
.o-search-wrap input:focus { border-color: var(--green); }
.o-search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); opacity: 0.4; pointer-events: none; }
.o-filter-group { display: flex; gap: 6px; }
.o-filter-pill { padding: 8px 14px; border-radius: 99px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1.5px solid var(--border); background: var(--card); color: var(--text-sub); transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
.o-filter-pill:hover { border-color: var(--green); color: var(--green); }
.o-filter-pill.active { background: var(--green); color: #fff; border-color: var(--green); }
.o-sort-select { padding: 9px 14px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 12px; border: 1.5px solid var(--border); background: var(--card); color: var(--text-sub); outline: none; cursor: pointer; }

/* ── Table card ── */
.o-table-card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8); overflow: hidden; animation: oFadeUp 0.35s 0.1s ease both; }
.o-table-wrap { overflow-x: auto; }
.o-table-wrap table { width: 100%; border-collapse: collapse; }
.o-table-wrap thead tr { border-bottom: 1px solid var(--border); }
.o-table-wrap thead th { padding: 14px 18px; font-size: 10px; font-weight: 600; letter-spacing: 1.3px; text-transform: uppercase; color: var(--label); text-align: left; white-space: nowrap; background: rgba(242,239,224,0.5); }
.o-table-wrap thead th.right { text-align: right; }
.o-table-wrap tbody tr { border-bottom: 1px solid rgba(58,107,80,0.05); transition: background 0.13s; }
.o-table-wrap tbody tr:last-child { border-bottom: none; }
.o-table-wrap tbody tr:hover { background: rgba(58,107,80,0.025); }
.o-table-wrap tbody td { padding: 14px 18px; font-size: 13px; vertical-align: middle; }
.o-table-wrap tbody td.right { text-align: right; }

/* ── Order ID btn ── */
.order-id-btn { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500; color: var(--green); background: var(--green-pale); padding: 4px 10px; border-radius: 7px; cursor: pointer; border: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 4px; }
.order-id-btn:hover { background: var(--green); color: #fff; transform: translateY(-1px); }

/* ── User cell ── */
.o-user-cell { display: flex; align-items: center; gap: 10px; }
.o-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--green); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
.o-user-name { font-size: 13px; font-weight: 600; color: var(--text); }
.o-user-email { font-size: 11px; color: var(--text-sub); margin-top: 1px; }

/* ── Status badges ── */
.o-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 11px; border-radius: 99px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.o-badge::before { content: '●'; font-size: 7px; }
.b-placed     { background: var(--blue-soft);  color: var(--blue); }
.b-confirmed  { background: #E6F4EC;            color: var(--green); }
.b-processing { background: var(--blue-soft);  color: var(--blue); }
.b-shipped    { background: var(--amber-soft);  color: var(--amber); }
.b-delivered  { background: #E6F4EC;            color: var(--green); }
.b-cancelled  { background: var(--red-soft);    color: var(--red); }
.b-pending    { background: var(--amber-soft);  color: var(--amber); }
.b-paid       { background: #E6F4EC;            color: var(--green); }
.b-failed     { background: var(--red-soft);    color: var(--red); }
.b-refunded   { background: #F5F5F0;            color: #9A9E90; }

/* ── Amount ── */
.o-amount { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600; color: var(--green); }

/* ── Row actions ── */
.o-row-actions { display: flex; gap: 6px; justify-content: flex-end; opacity: 0; transition: opacity 0.14s; }
.o-table-wrap tbody tr:hover .o-row-actions { opacity: 1; }
.o-row-btn { width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; color: var(--text-sub); }
.o-row-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-pale); }
.o-row-btn.danger:hover { border-color: var(--red); color: var(--red); background: var(--red-soft); }

/* ── Pagination ── */
.o-pagination { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
.o-page-info { font-size: 12px; color: var(--text-sub); }
.o-page-btns { display: flex; gap: 4px; }
.o-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card); font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: var(--text-sub); transition: all 0.13s; display: flex; align-items: center; justify-content: center; }
.o-page-btn:hover, .o-page-btn.active { background: var(--green); color: #fff; border-color: var(--green); }

/* ═══ ORDER DETAIL MODAL ═══ */
.o-overlay { position: fixed; inset: 0; background: rgba(15,25,15,0.38); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.22s; }
.o-overlay.open { opacity: 1; pointer-events: all; }
.o-modal { background: var(--card); border-radius: 26px; width: 100%; max-width: 580px; box-shadow: var(--shadow-lg); overflow: hidden; transform: translateY(24px) scale(0.97); transition: transform 0.26s cubic-bezier(.34,1.46,.64,1); max-height: 90vh; display: flex; flex-direction: column; }
.o-overlay.open .o-modal { transform: none; }

/* Modal hero */
.o-modal-hero { padding: 26px 28px 20px; background: linear-gradient(135deg, #EAF4EE 0%, #F8F6EC 60%, #F2EFE0 100%); border-bottom: 1px solid var(--border); position: relative; }
.o-modal-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-sub); transition: all 0.15s; font-size: 14px; }
.o-modal-close:hover { background: var(--green); color: #fff; border-color: var(--green); }
.o-modal-hero-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
.o-modal-icon { width: 52px; height: 52px; border-radius: 14px; background: var(--green); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 14px rgba(58,107,80,0.3); }
.o-modal-hero-id { font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--label); margin-bottom: 4px; }
.o-modal-hero-num { font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 500; color: var(--text); letter-spacing: -0.5px; }
.o-modal-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.o-modal-mini-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
.mms { background: rgba(255,255,255,0.7); border-radius: 12px; padding: 12px 14px; border: 1px solid rgba(58,107,80,0.08); }
.mms-label { font-size: 9px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--label); margin-bottom: 3px; }
.mms-val { font-size: 17px; font-weight: 700; color: var(--green); letter-spacing: -0.3px; }

/* Modal body */
.o-modal-body { padding: 22px 28px; overflow-y: auto; flex: 1; }
.o-modal-section { margin-bottom: 22px; }
.o-modal-section-title { font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase; color: var(--label); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.o-modal-section-title::after { content:''; flex:1; height:1px; background: var(--border); }
.o-info-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(58,107,80,0.06); }
.o-info-row:last-child { border-bottom: none; }
.o-info-key { font-size: 12px; color: var(--text-sub); font-weight: 500; }
.o-info-val { font-size: 13px; font-weight: 500; color: var(--text); }
.o-info-val.mono { font-family: 'DM Mono', monospace; }

/* Items list */
.o-item-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; background: #F9F8F3; margin-bottom: 6px; border: 1px solid var(--border); }
.o-item-row:last-child { margin-bottom: 0; }
.o-item-thumb { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--green-pale), var(--green)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; overflow: hidden; }
.o-item-thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
.o-item-name { font-size: 13px; font-weight: 600; color: var(--text); }
.o-item-meta { font-size: 11px; color: var(--text-sub); margin-top: 2px; }
.o-item-price { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600; color: var(--green); margin-left: auto; white-space: nowrap; }

/* Total breakdown */
.o-total-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid rgba(58,107,80,0.06); font-size: 13px; }
.o-total-row:last-child { border-bottom: none; padding-top: 10px; font-size: 15px; font-weight: 700; }
.o-total-row .t-label { color: var(--text-sub); }
.o-total-row .t-val { font-family: 'DM Mono', monospace; font-weight: 500; color: var(--text); }
.o-total-row:last-child .t-val { color: var(--green); font-weight: 700; }

/* Timeline */
.o-timeline { position: relative; padding-left: 20px; }
.o-timeline::before { content:''; position: absolute; left: 5px; top: 6px; bottom: 6px; width: 2px; background: var(--border); border-radius: 99px; }
.o-tl-item { position: relative; margin-bottom: 14px; }
.o-tl-item:last-child { margin-bottom: 0; }
.o-tl-dot { position: absolute; left: -20px; top: 3px; width: 12px; height: 12px; border-radius: 50%; background: var(--green); border: 2px solid var(--card); box-shadow: 0 0 0 1.5px var(--green); }
.o-tl-dot.inactive { background: #D0D5C8; box-shadow: 0 0 0 1.5px #D0D5C8; }
.o-tl-title { font-size: 13px; font-weight: 600; color: var(--text); }
.o-tl-time { font-size: 11px; color: var(--text-sub); margin-top: 1px; }

/* Modal footer */
.o-modal-footer { padding: 14px 28px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }

/* ── Animations ── */
@keyframes oFadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:translateY(0); } }

@media (max-width: 900px) {
  .o-stats-strip { grid-template-columns: repeat(3, 1fr); }
  .o-filter-group { display: none; }
  .o-page { padding: 20px 14px 40px; }
}
@media (max-width: 560px) {
  .o-stats-strip { grid-template-columns: 1fr 1fr; }
  .o-modal-mini-stats { grid-template-columns: 1fr 1fr; }
}
`;

const avatarColors = ['#3A6B50', '#5D6B9B', '#9B5D6B', '#6B9B5D', '#9B7A3A'];

function initials(name: string) {
  if (!name) return 'G';
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
}

function fmtAmt(n: number) {
  return '₹' + (n || 0).toLocaleString('en-IN');
}

function statusClass(s: string) {
  if (!s) return 'b-pending';
  return 'b-' + s.toLowerCase().replace(' ', '-');
}

function getTimeline(order: any) {
  const status = (order.orderStatus || '').toLowerCase();
  const payment = (order.paymentStatus || '').toLowerCase();
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const steps = [
    { label: 'Order Placed', time: date, done: true },
    { label: 'Payment Confirmed', time: payment === 'paid' ? 'Confirmed' : 'Pending', done: payment === 'paid' },
    { label: 'Processing', time: ['processing', 'shipped', 'delivered'].includes(status) ? 'In progress' : '—', done: ['processing', 'shipped', 'delivered'].includes(status) },
    { label: 'Shipped', time: ['shipped', 'delivered'].includes(status) ? 'Dispatched' : '—', done: ['shipped', 'delivered'].includes(status) },
    { label: 'Delivered', time: status === 'delivered' ? 'Completed' : '—', done: status === 'delivered' },
  ];
  return steps;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportFrom, setExportFrom] = useState('');
  const [exportTo, setExportTo] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPayment, setEditPayment] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); });
  }, []);

  // Close export panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setShowExport(false);
    }
    if (showExport) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showExport]);
  // Sync edit fields when order is selected
  useEffect(() => {
    if (selectedOrder) {
      setEditStatus(selectedOrder.orderStatus || 'placed');
      setEditPayment(selectedOrder.paymentStatus || 'pending');
      setEditTracking(selectedOrder.trackingNumber || '');
      setEditNote(selectedOrder.trackingNote || '');
      setUpdateSuccess(false);
      setUpdateError('');
    }
  }, [selectedOrder?._id]);

  async function updateOrderStatus() {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    setUpdateSuccess(false);
    setUpdateError('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          orderStatus: editStatus,
          paymentStatus: editPayment,
          trackingNumber: editTracking,
          trackingNote: editNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUpdateSuccess(true);
        // Merge updated fields back into local state
        const updatedOrder = { ...selectedOrder, orderStatus: editStatus, paymentStatus: editPayment, trackingNumber: editTracking, trackingNote: editNote };
        setSelectedOrder(updatedOrder);
        setOrders(prev => prev.map(o => o._id === selectedOrder._id ? updatedOrder : o));
      } else {
        setUpdateError(data.error || 'Failed to update');
      }
    } catch {
      setUpdateError('Network error, please try again');
    } finally {
      setUpdatingStatus(false);
    }
  }

  function handleExportOrders() {
    const params = new URLSearchParams();
    if (exportFrom) params.set('from', exportFrom);
    if (exportTo) params.set('to', exportTo);
    window.location.href = `/api/admin/export/orders?${params.toString()}`;
    setShowExport(false);
  }

  function printReceipt(order: any) {
    const addr = order.shippingAddress || {};
    const addrLine = [addr.address || addr.street, addr.city, addr.state, addr.pincode || addr.postalCode].filter(Boolean).join(', ');
    const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const items = (order.items || []);
    const discount = order.discountAmount || 0;
    const shipping = order.shippingFee || 0;

    const itemsHTML = items.map((it: any) =>
      `<tr>
        <td style="font-size:6pt;padding:1mm 0;border-bottom:1px dashed #eee">${it.name || it.product?.name || 'Item'}${it.size ? ' (' + it.size + ')' : ''}</td>
        <td style="font-size:6pt;text-align:center;padding:1mm 0;border-bottom:1px dashed #eee">x${it.quantity || 1}</td>
        <td style="font-size:6pt;text-align:right;padding:1mm 0;border-bottom:1px dashed #eee">&#8377;${((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</td>
      </tr>`
    ).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Receipt - #${order._id.slice(-6)}</title>
<style>
  @page { size: 60mm 100mm; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Arial', sans-serif; width: 60mm; padding: 3mm; background: #fff; color: #111; }
  .logo { text-align: center; font-size: 11pt; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1mm; }
  .logo span { display: block; font-size: 5pt; font-weight: 400; letter-spacing: 3px; color: #666; margin-top: 0.5mm; }
  .divider { border: none; border-top: 1.5px dashed #bbb; margin: 2mm 0; }
  .order-num { text-align: center; font-size: 7pt; font-weight: 700; letter-spacing: 1px; margin-bottom: 1mm; }
  .date { text-align: center; font-size: 5.5pt; color: #666; margin-bottom: 2mm; }
  .section-title { font-size: 5.5pt; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #888; margin-bottom: 1.5mm; }
  .addr { font-size: 6pt; line-height: 1.5; }
  .addr strong { font-size: 7pt; display: block; margin-bottom: 0.5mm; }
  table { width: 100%; border-collapse: collapse; }
  .totals td { font-size: 6.5pt; padding: 0.8mm 0; }
  .totals .grand td { font-size: 8pt; font-weight: 700; padding-top: 1.5mm; }
  .footer { text-align: center; font-size: 5pt; color: #999; margin-top: 2mm; letter-spacing: 0.5px; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="logo">Sati Threads<span>Premium Ethnic Wear</span></div>
  <hr class="divider">
  <div class="order-num">ORDER #${order._id.slice(-6).toUpperCase()}</div>
  <div class="date">${dateStr}</div>
  <hr class="divider">
  <div class="section-title">Ship To</div>
  <div class="addr">
    <strong>${addr.name || order.user?.name || 'Customer'}</strong>
    ${addrLine}<br/>
    ${addr.phone || order.user?.phone || ''}
  </div>
  <hr class="divider">
  <div class="section-title">Items</div>
  <table><tbody>${itemsHTML}</tbody></table>
  <hr class="divider">
  <table class="totals"><tbody>
    ${discount > 0 ? `<tr><td>Discount</td><td style="text-align:right">-&#8377;${discount.toLocaleString('en-IN')}</td></tr>` : ''}
    <tr><td>Shipping</td><td style="text-align:right">${shipping > 0 ? '&#8377;' + shipping.toLocaleString('en-IN') : 'Free'}</td></tr>
    <tr class="grand"><td><strong>Total</strong></td><td style="text-align:right"><strong>&#8377;${(order.totalAmount || 0).toLocaleString('en-IN')}</strong></td></tr>
  </tbody></table>
  <hr class="divider">
  <div class="footer">Thank you for shopping with us!<br/>satithreads.com</div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=350,height=500');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  }

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o._id?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') {
      list = list.filter(o => (o.orderStatus || '').toLowerCase() === filter);
    }
    list.sort((a, b) => {
      if (sort === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'amount-desc') return b.totalAmount - a.totalAmount;
      if (sort === 'amount-asc') return a.totalAmount - b.totalAmount;
      return 0;
    });
    return list;
  }, [orders, search, filter, sort]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const avg = total > 0 ? Math.round(revenue / total) : 0;
    const pending = orders.filter(o => (o.paymentStatus || '').toLowerCase() !== 'paid').length;
    const cancelled = orders.filter(o => (o.orderStatus || '').toLowerCase() === 'cancelled').length;
    return { total, revenue, avg, pending, cancelled };
  }, [orders]);

  if (loading) return (
    <div style={{ padding: '40px', fontFamily: 'DM Sans, sans-serif', color: '#7A8070' }}>
      Loading orders...
    </div>
  );

  const timeline = selectedOrder ? getTimeline(selectedOrder) : [];

  return (
    <div className="o-page">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* Header */}
      <div className="o-header">
        <div>
          <h1>Orders</h1>
          <p>Track, manage, and fulfil all customer orders</p>
        </div>
        <div className="o-header-actions" style={{ position: 'relative' }} ref={exportRef}>
          <button className="o-btn o-btn-ghost" onClick={() => setShowExport(!showExport)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Export CSV
          </button>
          {showExport && (
            <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 200, background: '#fff', borderRadius: 18, boxShadow: '0 12px 48px rgba(40,60,40,0.16)', border: '1px solid rgba(58,107,80,0.12)', padding: '20px 22px', minWidth: 280 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: '#1A1A14' }}>Export Orders to CSV</div>
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
                <button onClick={handleExportOrders} style={{ flex: 2, padding: '9px', borderRadius: 10, border: 'none', background: '#3A6B50', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Download CSV
                </button>
              </div>
              <div style={{ fontSize: 10, color: '#9A9E90', marginTop: 10, textAlign: 'center' }}>Leave dates empty to export all orders</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="o-stats-strip">
        <div className="o-stat-card">
          <div className="s-label">Total Orders</div>
          <div className="s-val">{stats.total}</div>
          <div className="s-badge up">↑ Live from DB</div>
        </div>
        <div className="o-stat-card">
          <div className="s-label">Total Revenue</div>
          <div className="s-val">{fmtAmt(stats.revenue)}</div>
          <div className="s-badge up">Lifetime earnings</div>
        </div>
        <div className="o-stat-card">
          <div className="s-label">Avg Order Value</div>
          <div className="s-val">{fmtAmt(stats.avg)}</div>
          <div className="s-badge up">Per order</div>
        </div>
        <div className="o-stat-card">
          <div className="s-label">Pending Payment</div>
          <div className={`s-val${stats.pending > 0 ? ' amber' : ''}`}>{stats.pending}</div>
          <div className={`s-badge${stats.pending > 0 ? ' warn' : ' neutral'}`}>
            {stats.pending > 0 ? 'Needs attention' : '— all paid'}
          </div>
        </div>
        <div className="o-stat-card">
          <div className="s-label">Cancelled</div>
          <div className={`s-val${stats.cancelled > 0 ? ' danger' : ''}`}>{stats.cancelled}</div>
          <div className={`s-badge${stats.cancelled > 0 ? ' warn' : ' neutral'}`}>
            {stats.cancelled === 0 ? '— no cancellations' : `${stats.cancelled} cancelled`}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="o-toolbar">
        <div className="o-search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            placeholder="Search by order ID, customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="o-filter-group">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'placed', label: 'Placed' },
            { key: 'shipped', label: 'Shipped' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map(f => (
            <button
              key={f.key}
              className={`o-filter-pill${filter === f.key ? ' active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select className="o-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date-desc">Sort: Newest First</option>
          <option value="date-asc">Sort: Oldest First</option>
          <option value="amount-desc">Sort: Amount ↓</option>
          <option value="amount-asc">Sort: Amount ↑</option>
        </select>
      </div>

      {/* Table */}
      <div className="o-table-card">
        <div className="o-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Items</th>
                <th className="right">Total</th>
                <th>Date</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o, i) => (
                <tr key={o._id}>
                  <td>
                    <button className="order-id-btn" onClick={() => setSelectedOrder(o)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /></svg>
                      #{o._id.slice(-6)}
                    </button>
                  </td>
                  <td>
                    <div className="o-user-cell">
                      <div className="o-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                        {initials(o.user?.name)}
                      </div>
                      <div>
                        <div className="o-user-name">{o.user?.name || 'Guest'}</div>
                        <div className="o-user-email">{o.user?.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`o-badge ${statusClass(o.orderStatus)}`}>
                      {o.orderStatus || 'Placed'}
                    </span>
                  </td>
                  <td>
                    <span className={`o-badge ${statusClass(o.paymentStatus)}`}>
                      {o.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-sub)', fontSize: '12px' }}>
                    {(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}
                  </td>
                  <td className="right">
                    <span className="o-amount">{fmtAmt(o.totalAmount)}</span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="o-row-actions">
                      <button className="o-row-btn" title="View" onClick={() => setSelectedOrder(o)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                      <button className="o-row-btn danger" title="Cancel">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="o-pagination">
          <div className="o-page-info">Showing {filteredOrders.length} of {orders.length} orders</div>
          <div className="o-page-btns">
            <button className="o-page-btn">‹</button>
            <button className="o-page-btn active">1</button>
            <button className="o-page-btn">›</button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <div
        className={`o-overlay${selectedOrder ? ' open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setSelectedOrder(null); }}
      >
        {selectedOrder && (
          <div className="o-modal">
            <div className="o-modal-hero">
              <button className="o-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
              <div className="o-modal-hero-top">
                <div className="o-modal-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                </div>
                <div>
                  <div className="o-modal-hero-id">Order ID</div>
                  <div className="o-modal-hero-num">#{selectedOrder._id.slice(-6)}</div>
                </div>
              </div>
              <div className="o-modal-badges">
                <span className={`o-badge ${statusClass(selectedOrder.orderStatus)}`}>{selectedOrder.orderStatus || 'Placed'}</span>
                <span className={`o-badge ${statusClass(selectedOrder.paymentStatus)}`}>Payment: {selectedOrder.paymentStatus || 'Pending'}</span>
              </div>
              <div className="o-modal-mini-stats">
                <div className="mms"><div className="mms-label">Total</div><div className="mms-val">{fmtAmt(selectedOrder.totalAmount)}</div></div>
                <div className="mms"><div className="mms-label">Items</div><div className="mms-val">{(selectedOrder.items || []).length}</div></div>
                <div className="mms"><div className="mms-label">Date</div><div className="mms-val" style={{ fontSize: '12px', letterSpacing: 0, fontWeight: 600 }}>{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div></div>
              </div>
            </div>
            <div className="o-modal-body">
              {/* Customer */}
              <div className="o-modal-section">
                <div className="o-modal-section-title">Customer</div>
                <div className="o-info-row"><span className="o-info-key">Name</span><span className="o-info-val">{selectedOrder.user?.name || 'Guest'}</span></div>
                <div className="o-info-row"><span className="o-info-key">Email</span><span className="o-info-val mono">{selectedOrder.user?.email || '—'}</span></div>
                <div className="o-info-row"><span className="o-info-key">Order Time</span><span className="o-info-val mono">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span></div>
                {selectedOrder.shippingAddress && (
                  <div className="o-info-row">
                    <span className="o-info-key">Address</span>
                    <span className="o-info-val" style={{ textAlign: 'right', maxWidth: '240px' }}>
                      {[selectedOrder.shippingAddress.street, selectedOrder.shippingAddress.city, selectedOrder.shippingAddress.state, selectedOrder.shippingAddress.postalCode].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
              {/* Items */}
              <div className="o-modal-section">
                <div className="o-modal-section-title">Order Items</div>
                {(selectedOrder.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="o-item-row">
                    <div className="o-item-thumb">
                      {item.product?.mainImage
                        ? <img src={item.product.mainImage} alt={item.product?.name} />
                        : '👕'}
                    </div>
                    <div>
                      <div className="o-item-name">{item.product?.name || 'Product'}</div>
                      <div className="o-item-meta">
                        {item.size && `Size: ${item.size}`}{item.color && ` · ${item.color}`} · Qty: {item.quantity || 1}
                      </div>
                    </div>
                    <div className="o-item-price">{fmtAmt((item.price || 0) * (item.quantity || 1))}</div>
                  </div>
                ))}
              </div>
              {/* Price breakdown */}
              <div className="o-modal-section">
                <div className="o-modal-section-title">Price Breakdown</div>
                <div className="o-total-row"><span className="t-label">Subtotal</span><span className="t-val">{fmtAmt(selectedOrder.totalAmount)}</span></div>
                <div className="o-total-row"><span className="t-label">Discount</span><span className="t-val">₹0</span></div>
                <div className="o-total-row"><span className="t-label">Shipping</span><span className="t-val">Free</span></div>
                <div className="o-total-row"><span className="t-label" style={{ color: 'var(--text)' }}>Grand Total</span><span className="t-val">{fmtAmt(selectedOrder.totalAmount)}</span></div>
              </div>
              {/* Update Order Status */}
              <div className="o-modal-section">
                <div className="o-modal-section-title">Update Order Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 5 }}>Order Status</div>
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, background: '#F9F8F3', outline: 'none', cursor: 'pointer' }}>
                      <option value="placed">📦 Placed</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="processing">⚙️ Processing</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="delivered">🎉 Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 5 }}>Payment Status</div>
                    <select value={editPayment} onChange={e => setEditPayment(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, background: '#F9F8F3', outline: 'none', cursor: 'pointer' }}>
                      <option value="pending">⏳ Pending</option>
                      <option value="paid">💚 Paid</option>
                      <option value="failed">❗ Failed</option>
                      <option value="refunded">↩️ Refunded</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 5 }}>Tracking Number <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#aaa' }}>(optional)</span></div>
                  <input type="text" value={editTracking} onChange={e => setEditTracking(e.target.value)} placeholder="e.g. IND123456789"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, background: '#F9F8F3', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label)', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 5 }}>Status Note <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: '#aaa' }}>(shown to customer)</span></div>
                  <input type="text" value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="e.g. Your package has left our facility"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, background: '#F9F8F3', outline: 'none' }} />
                </div>
                {updateSuccess && <div style={{ color: '#3A6B50', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>✅ Order updated successfully!</div>}
                {updateError && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>⚠️ {updateError}</div>}
                <button onClick={updateOrderStatus} disabled={updatingStatus}
                  style={{ width: '100%', padding: '11px', borderRadius: 12, border: 'none', background: updatingStatus ? '#ccc' : '#3A6B50', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, cursor: updatingStatus ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {updatingStatus ? 'Saving...' : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
              {/* Timeline */}
              <div className="o-modal-section">
                <div className="o-modal-section-title">Order Timeline</div>
                <div className="o-timeline">
                  {timeline.map((t, idx) => (
                    <div key={idx} className="o-tl-item">
                      <div className={`o-tl-dot${t.done ? '' : ' inactive'}`}></div>
                      <div className="o-tl-title" style={{ color: t.done ? 'var(--text)' : 'var(--text-sub)' }}>{t.label}</div>
                      <div className="o-tl-time">{t.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="o-modal-footer">
              <button className="o-btn o-btn-ghost" onClick={() => setSelectedOrder(null)}>Close</button>
              <button className="o-btn o-btn-ghost" onClick={() => printReceipt(selectedOrder)} style={{ borderColor: 'rgba(58,107,80,0.3)', color: '#3A6B50' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                Print Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}