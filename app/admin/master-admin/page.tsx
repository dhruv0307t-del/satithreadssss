"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    totalOrders?: number;
}

interface AdminLog {
    _id: string;
    adminEmail: string;
    action: string;
    targetUserEmail?: string;
    details?: string;
    createdAt: string;
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
  --border: rgba(58,107,80,0.10);
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

/* ── Page ── */
.ma-page { width: 100%; padding: 40px 32px 80px; font-family: 'DM Sans', sans-serif; color: var(--text); }

/* ── Header ── */
.ma-header { margin-bottom: 28px; }
.ma-header-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.ma-header-left { display: flex; align-items: center; gap: 14px; }
.ma-shield-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--green); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(58,107,80,0.3); flex-shrink: 0; }
.ma-header h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.8px; line-height: 1; }
.ma-header p { font-size: 13px; color: var(--text-sub); margin-top: 3px; }
.ma-header-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--red-soft); color: var(--red); padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; border: 1px solid rgba(192,57,43,0.15); }

/* ── Stats ── */
.ma-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; animation: maFadeUp 0.3s ease both; }
.ma-stat-card { background: var(--card); border-radius: var(--radius); padding: 22px 24px; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.9); transition: transform 0.18s, box-shadow 0.18s; position: relative; overflow: hidden; }
.ma-stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: var(--radius) var(--radius) 0 0; }
.ma-stat-card.total::before { background: linear-gradient(90deg, var(--green), var(--green-light)); }
.ma-stat-card.master::before { background: linear-gradient(90deg, #9B6B3A, #D4956A); }
.ma-stat-card.regular::before { background: linear-gradient(90deg, var(--blue), #5A9BB0); }
.ma-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.ma-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-size: 18px; }
.ma-stat-icon.g { background: var(--green-pale); }
.ma-stat-icon.a { background: var(--amber-soft); }
.ma-stat-icon.b { background: var(--blue-soft); }
.ma-stat-label { font-size: 10px; font-weight: 600; letter-spacing: 1.3px; text-transform: uppercase; color: var(--label); margin-bottom: 6px; }
.ma-stat-value { font-size: 38px; font-weight: 700; color: var(--text); letter-spacing: -1.5px; line-height: 1; }
.ma-stat-value.g { color: var(--green); }
.ma-stat-value.a { color: #9B6B3A; }
.ma-stat-value.b { color: var(--blue); }
.ma-stat-cap { font-size: 12px; color: var(--text-sub); margin-top: 5px; }
.ma-stat-cap strong { color: var(--text); font-weight: 600; }
.ma-quota-bar { height: 5px; background: rgba(58,107,80,0.1); border-radius: 99px; overflow: hidden; margin-top: 10px; }
.ma-quota-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #9B6B3A, #D4956A); transition: width 0.8s; }

/* ── Tabs ── */
.ma-tabs-wrap { margin-bottom: 20px; animation: maFadeUp 0.3s 0.05s ease both; }
.ma-tab-group { display: flex; gap: 4px; background: rgba(255,255,255,0.6); border-radius: 99px; padding: 4px; border: 1px solid var(--border); width: fit-content; }
.ma-tab-btn { padding: 8px 20px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-sub); transition: all 0.16s; border: none; background: transparent; display: flex; align-items: center; gap: 7px; }
.ma-tab-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); }
.ma-tab-btn.active { background: var(--card); color: var(--green); font-weight: 600; box-shadow: 0 1px 6px rgba(0,0,0,0.08); }
.ma-tab-btn.active .ma-tab-dot { background: var(--green); }

/* ── Card ── */
.ma-card { background: var(--card); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.9); margin-bottom: 16px; animation: maFadeUp 0.3s 0.1s ease both; }

/* ── Section header ── */
.ma-sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
.ma-sec-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 17px; }
.ma-sec-title { font-size: 17px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
.ma-sec-sub { font-size: 12px; color: var(--text-sub); margin-top: 2px; }

/* ── Form ── */
.ma-field { display: flex; flex-direction: column; gap: 6px; }
.ma-field label { font-size: 12px; font-weight: 600; color: var(--text); }
.ma-field input, .ma-field select {
  width: 100%; padding: 12px 16px; border-radius: var(--radius-sm);
  border: 1.5px solid var(--border); background: #FAFAF7;
  font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--text);
  outline: none; transition: border-color 0.17s, box-shadow 0.17s, background 0.17s;
  appearance: none; -webkit-appearance: none;
}
.ma-field input:focus, .ma-field select:focus { border-color: var(--green); background: #fff; box-shadow: 0 0 0 3px rgba(58,107,80,0.08); }
.ma-field input::placeholder { color: #B0B5A8; }
.ma-form-row { display: grid; gap: 14px; margin-bottom: 16px; }
.ma-form-row.cols-2 { grid-template-columns: 1fr 1fr; }
.ma-form-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.ma-select-wrap { position: relative; }
.ma-select-wrap select { padding-right: 36px; cursor: pointer; }
.ma-select-wrap::after { content: ''; position: absolute; right: 13px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid var(--label); pointer-events: none; }

/* ── Buttons ── */
.ma-btn { display: inline-flex; align-items: center; gap: 7px; padding: 11px 22px; border-radius: 99px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.17s; }
.ma-btn-primary { background: var(--green); color: #fff; box-shadow: 0 2px 10px rgba(58,107,80,0.25); }
.ma-btn-primary:hover { background: #2e5640; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(58,107,80,0.3); }
.ma-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.ma-btn-blue { background: var(--blue); color: #fff; box-shadow: 0 2px 10px rgba(44,110,138,0.25); }
.ma-btn-blue:hover { background: #235A72; transform: translateY(-1px); }
.ma-btn-ghost { background: var(--card); color: var(--text-sub); border: 1.5px solid var(--border); }
.ma-btn-ghost:hover { border-color: var(--green); color: var(--green); }
.ma-btn-danger { background: var(--red-soft); color: var(--red); border: 1.5px solid rgba(192,57,43,0.15); }
.ma-btn-danger:hover { background: var(--red); color: #fff; }
.ma-btn-full { width: 100%; justify-content: center; margin-top: 8px; }

/* ── OR divider ── */
.ma-or-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.ma-or-divider::before, .ma-or-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.ma-or-divider span { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--label); }

/* ── Admins table ── */
.ma-admins-table { width: 100%; border-collapse: collapse; }
.ma-admins-table thead tr { border-bottom: 1px solid var(--border); }
.ma-admins-table thead th { padding: 11px 14px; font-size: 10px; font-weight: 600; letter-spacing: 1.3px; text-transform: uppercase; color: var(--label); text-align: left; background: rgba(242,239,224,0.5); }
.ma-admins-table thead th:last-child { text-align: right; }
.ma-admins-table tbody tr { border-bottom: 1px solid rgba(58,107,80,0.05); transition: background 0.12s; }
.ma-admins-table tbody tr:last-child { border-bottom: none; }
.ma-admins-table tbody tr:hover { background: rgba(58,107,80,0.025); }
.ma-admins-table td { padding: 14px; font-size: 13px; vertical-align: middle; }
.ma-admins-table td:last-child { text-align: right; }
.ma-admin-cell { display: flex; align-items: center; gap: 11px; }
.ma-admin-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
.ma-admin-name { font-size: 13px; font-weight: 600; color: var(--text); }
.ma-admin-email { font-size: 11px; color: var(--text-sub); font-family: 'DM Mono', monospace; margin-top: 1px; }

/* ── Role badge ── */
.ma-role-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 11px; border-radius: 99px; font-size: 11px; font-weight: 600; }
.ma-role-badge::before { content: '●'; font-size: 7px; }
.rb-master { background: #FEF3E2; color: #9B6B3A; }
.rb-admin { background: var(--blue-soft); color: var(--blue); }

/* ── Row actions ── */
.ma-row-actions { display: flex; gap: 5px; justify-content: flex-end; opacity: 0; transition: opacity 0.13s; }
.ma-admins-table tbody tr:hover .ma-row-actions { opacity: 1; }
.ma-row-btn { width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.13s; color: var(--text-sub); }
.ma-row-btn:hover { border-color: var(--green); color: var(--green); background: var(--green-pale); }
.ma-row-btn.danger:hover { border-color: var(--red); color: var(--red); background: var(--red-soft); }
.ma-protected-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--label); font-weight: 500; }

/* ── Activity log ── */
.ma-log-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid rgba(58,107,80,0.06); }
.ma-log-item:last-child { border-bottom: none; }
.ma-log-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.ma-log-dot.green { background: var(--green); }
.ma-log-dot.amber { background: var(--amber); }
.ma-log-dot.red { background: var(--red); }
.ma-log-dot.blue { background: var(--blue); }
.ma-log-text { flex: 1; font-size: 13px; color: var(--text); line-height: 1.4; }
.ma-log-text strong { color: var(--green); font-weight: 600; }
.ma-log-time { font-size: 11px; color: var(--text-sub); font-family: 'DM Mono', monospace; white-space: nowrap; }

/* ── Danger zone ── */
.ma-danger-zone { border: 1.5px solid rgba(192,57,43,0.2); border-radius: var(--radius-sm); padding: 18px 20px; background: #FFF9F9; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.ma-dz-info strong { font-size: 13px; color: var(--red); display: block; margin-bottom: 3px; }
.ma-dz-info span { font-size: 12px; color: var(--text-sub); }

/* ── Modal ── */
.ma-overlay { position: fixed; inset: 0; background: rgba(15,25,15,0.35); backdrop-filter: blur(5px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.22s; }
.ma-overlay.open { opacity: 1; pointer-events: all; }
.ma-modal { background: var(--card); border-radius: 24px; width: 100%; max-width: 460px; box-shadow: var(--shadow-lg); transform: translateY(20px) scale(0.97); transition: transform 0.25s cubic-bezier(.34,1.46,.64,1); overflow: hidden; }
.ma-overlay.open .ma-modal { transform: none; }
.ma-modal-header { padding: 24px 26px 20px; background: linear-gradient(135deg, var(--green-pale), #F8F6EC); border-bottom: 1px solid var(--border); }
.ma-modal-title { font-size: 18px; font-weight: 700; color: var(--text); }
.ma-modal-sub { font-size: 13px; color: var(--text-sub); margin-top: 3px; }
.ma-modal-body { padding: 24px 26px; }
.ma-modal-footer { padding: 16px 26px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }

/* ── Animations ── */
@keyframes maFadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

@media (max-width: 700px) {
  .ma-page { padding: 20px 14px 60px; }
  .ma-stats-grid { grid-template-columns: 1fr; }
  .ma-form-row.cols-2, .ma-form-row.cols-3 { grid-template-columns: 1fr; }
}
`;

const avatarColors = ['#3A6B50', '#5D6B9B', '#9B5D6B', '#9B7A3A', '#6B5D9B'];
function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function logDotColor(action: string) {
    if (action?.toLowerCase().includes('login')) return 'green';
    if (action?.toLowerCase().includes('delete') || action?.toLowerCase().includes('remove')) return 'red';
    if (action?.toLowerCase().includes('update') || action?.toLowerCase().includes('change')) return 'amber';
    return 'blue';
}
function fmtDate(d: string) {
    try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
}

export default function MasterAdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'management' | 'logs'>('management');
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [logs, setLogs] = useState<AdminLog[]>([]);
    const [stats, setStats] = useState({ totalAdmins: 0, masterAdmins: 0, regularAdmins: 0 });
    const [loading, setLoading] = useState(false);

    // Promote state
    const [promoteEmail, setPromoteEmail] = useState('');
    const [promoteRole, setPromoteRole] = useState('admin');

    // Create state
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newConfirm, setNewConfirm] = useState('');
    const [newRole, setNewRole] = useState('admin');

    // Edit modal
    const [editOverlay, setEditOverlay] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('admin');

    // Remove modal
    const [removeOverlay, setRemoveOverlay] = useState(false);
    const [removingAdmin, setRemovingAdmin] = useState<Admin | null>(null);

    // Password modal
    const [pwOverlay, setPwOverlay] = useState(false);
    const [pwAdmin, setPwAdmin] = useState<Admin | null>(null);
    const [pwValue, setPwValue] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login');
        else if (status === 'authenticated' && session?.user?.role !== 'master_admin') router.push('/admin');
    }, [status, session, router]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'master_admin') {
            fetchAdmins(); fetchLogs();
        }
    }, [status, session]);

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/master-admin/admins');
            const data = await res.json();
            if (data.success) { setAdmins(data.admins); setStats(data.stats); }
        } catch (e) { console.error(e); }
    };

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/master-admin/logs');
            const data = await res.json();
            if (data.success) setLogs(data.logs);
        } catch (e) { console.error(e); }
    };

    const showToast = (msg: string, type: 'success' | 'error') => {
        const t = document.createElement('div');
        t.style.cssText = `position:fixed;bottom:30px;right:24px;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,0.15);font-family:DM Sans,sans-serif;background:${type === 'success' ? 'var(--green)' : 'var(--red)'};color:#fff;transition:all 0.3s`;
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
    };

    const handlePromote = async () => {
        if (!promoteEmail) { showToast('Please enter a user email', 'error'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/master-admin/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'promote', email: promoteEmail, role: promoteRole }),
            });
            const data = await res.json();
            if (data.success) { showToast('User promoted successfully ✓', 'success'); setPromoteEmail(''); fetchAdmins(); }
            else showToast(data.message || 'Failed to promote user', 'error');
        } catch { showToast('Error promoting user', 'error'); }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!newName || !newEmail || !newPassword) { showToast('Please fill all required fields', 'error'); return; }
        if (newPassword !== newConfirm) { showToast('Passwords do not match', 'error'); return; }
        if (newPassword.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/master-admin/admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', name: newName, email: newEmail, password: newPassword, role: newRole }),
            });
            const data = await res.json();
            if (data.success) {
                showToast('Admin account created successfully! 🎉', 'success');
                setNewName(''); setNewEmail(''); setNewPassword(''); setNewConfirm('');
                fetchAdmins();
            } else showToast(data.message || 'Failed to create admin', 'error');
        } catch { showToast('Error creating admin', 'error'); }
        setLoading(false);
    };

    const openEdit = (admin: Admin) => {
        setEditingAdmin(admin); setEditName(admin.name); setEditRole(admin.role);
        setEditOverlay(true);
    };
    const saveEdit = async () => {
        if (!editingAdmin) return;
        try {
            const res = await fetch(`/api/master-admin/admins/${editingAdmin._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, role: editRole }),
            });
            const data = await res.json();
            if (data.success) { showToast('Admin updated ✓', 'success'); fetchAdmins(); }
            else showToast(data.message || 'Failed', 'error');
        } catch { showToast('Error updating admin', 'error'); }
        setEditOverlay(false);
    };

    const openRemove = (admin: Admin) => { setRemovingAdmin(admin); setRemoveOverlay(true); };
    const confirmRemove = async () => {
        if (!removingAdmin) return;
        try {
            const res = await fetch(`/api/master-admin/admins/${removingAdmin._id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) { showToast('Admin removed', 'success'); fetchAdmins(); }
            else showToast(data.message || 'Failed', 'error');
        } catch { showToast('Error removing admin', 'error'); }
        setRemoveOverlay(false);
    };

    const openPassword = (admin: Admin) => { setPwAdmin(admin); setPwValue(''); setPwOverlay(true); };
    const savePassword = async () => {
        if (!pwAdmin || !pwValue || pwValue.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }
        try {
            const res = await fetch(`/api/master-admin/admins/${pwAdmin._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwValue }),
            });
            const data = await res.json();
            if (data.success) { showToast('Password changed ✓', 'success'); setPwOverlay(false); }
            else showToast(data.message || 'Failed', 'error');
        } catch { showToast('Error', 'error'); }
    };

    const masterCount = stats.masterAdmins || admins.filter(a => a.role === 'master_admin').length;
    const regularCount = stats.regularAdmins || admins.filter(a => a.role !== 'master_admin').length;

    if (status === 'loading') return (
        <div style={{ padding: '40px', fontFamily: 'DM Sans, sans-serif', color: '#7A8070' }}>Loading…</div>
    );

    return (
        <div className="ma-page">
            <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

            {/* Header */}
            <div className="ma-header">
                <div className="ma-header-top">
                    <div className="ma-header-left">
                        <div className="ma-shield-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <div>
                            <h1>Master Admin Control Panel</h1>
                            <p>Manage admin access, permissions, and activity logs</p>
                        </div>
                    </div>
                    <div className="ma-header-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        Restricted Access
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="ma-stats-grid">
                <div className="ma-stat-card total">
                    <div className="ma-stat-icon g">👥</div>
                    <div className="ma-stat-label">Total Admins</div>
                    <div className="ma-stat-value g">{stats.totalAdmins || admins.length}</div>
                    <div className="ma-stat-cap">Active admin accounts on the platform</div>
                </div>
                <div className="ma-stat-card master">
                    <div className="ma-stat-icon a">🛡️</div>
                    <div className="ma-stat-label">Master Admins</div>
                    <div className="ma-stat-value a">{masterCount}</div>
                    <div className="ma-stat-cap"><strong>{masterCount}</strong> of <strong>2</strong> slots used</div>
                    <div className="ma-quota-bar"><div className="ma-quota-fill" style={{ width: `${(masterCount / 2) * 100}%` }} /></div>
                </div>
                <div className="ma-stat-card regular">
                    <div className="ma-stat-icon b">👤</div>
                    <div className="ma-stat-label">Regular Admins</div>
                    <div className="ma-stat-value b">{regularCount}</div>
                    <div className="ma-stat-cap">{regularCount === 0 ? 'No regular admins assigned yet' : `${regularCount} active regular admin${regularCount > 1 ? 's' : ''}`}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="ma-tabs-wrap">
                <div className="ma-tab-group">
                    <button className={`ma-tab-btn${activeTab === 'management' ? ' active' : ''}`} onClick={() => setActiveTab('management')}>
                        <div className="ma-tab-dot" />Admin Management
                    </button>
                    <button className={`ma-tab-btn${activeTab === 'logs' ? ' active' : ''}`} onClick={() => setActiveTab('logs')}>
                        <div className="ma-tab-dot" />Activity Logs
                    </button>
                </div>
            </div>

            {/* ── MANAGEMENT TAB ── */}
            {activeTab === 'management' && (
                <>
                    {/* Promote Existing User */}
                    <div className="ma-card">
                        <div className="ma-sec-header">
                            <div className="ma-sec-icon" style={{ background: 'var(--blue-soft)' }}>👥</div>
                            <div>
                                <div className="ma-sec-title">Promote Existing User</div>
                                <div className="ma-sec-sub">Elevate a registered user to admin role</div>
                            </div>
                        </div>
                        <div className="ma-form-row cols-2">
                            <div className="ma-field">
                                <label>User Email</label>
                                <input type="email" placeholder="Enter registered user email…" value={promoteEmail} onChange={e => setPromoteEmail(e.target.value)} />
                            </div>
                            <div className="ma-field">
                                <label>Assign Role</label>
                                <div className="ma-select-wrap">
                                    <select value={promoteRole} onChange={e => setPromoteRole(e.target.value)}>
                                        <option value="admin">Regular Admin</option>
                                        <option value="master_admin">Master Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button className="ma-btn ma-btn-blue ma-btn-full" onClick={handlePromote} disabled={loading}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                            Promote to Admin
                        </button>
                    </div>

                    <div className="ma-or-divider"><span>or create a new admin account</span></div>

                    {/* Create New Admin */}
                    <div className="ma-card">
                        <div className="ma-sec-header">
                            <div className="ma-sec-icon" style={{ background: 'var(--green-pale)' }}>➕</div>
                            <div>
                                <div className="ma-sec-title">Create New Admin</div>
                                <div className="ma-sec-sub">Create a fresh admin account (no prior account needed)</div>
                            </div>
                        </div>
                        <div className="ma-form-row cols-2">
                            <div className="ma-field">
                                <label>Full Name</label>
                                <input type="text" placeholder="e.g. Priya Sharma" value={newName} onChange={e => setNewName(e.target.value)} />
                            </div>
                            <div className="ma-field">
                                <label>Email Address</label>
                                <input type="email" placeholder="admin@yourstore.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="ma-form-row cols-3">
                            <div className="ma-field">
                                <label>Password</label>
                                <input type="password" placeholder="Min. 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <div className="ma-field">
                                <label>Confirm Password</label>
                                <input type="password" placeholder="Re-enter password" value={newConfirm} onChange={e => setNewConfirm(e.target.value)} />
                            </div>
                            <div className="ma-field">
                                <label>Role</label>
                                <div className="ma-select-wrap">
                                    <select value={newRole} onChange={e => setNewRole(e.target.value)}>
                                        <option value="admin">Regular Admin</option>
                                        <option value="master_admin">Master Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button className="ma-btn ma-btn-primary ma-btn-full" onClick={handleCreate} disabled={loading}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                            {loading ? 'Creating…' : 'Create Admin Account'}
                        </button>
                    </div>

                    {/* Admins Table */}
                    <div className="ma-card">
                        <div className="ma-sec-header">
                            <div className="ma-sec-icon" style={{ background: 'var(--amber-soft)' }}>📋</div>
                            <div>
                                <div className="ma-sec-title">Current Admins</div>
                                <div className="ma-sec-sub">Manage permissions and access for all admin accounts</div>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="ma-admins-table">
                                <thead>
                                    <tr>
                                        <th>Admin</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Orders</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((a, i) => {
                                        const isProtected = session?.user?.email === a.email;
                                        return (
                                            <tr key={a._id}>
                                                <td>
                                                    <div className="ma-admin-cell">
                                                        <div className="ma-admin-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{initials(a.name)}</div>
                                                        <div>
                                                            <div className="ma-admin-name">{a.name}</div>
                                                            <div className="ma-admin-email">{a.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`ma-role-badge ${a.role === 'master_admin' ? 'rb-master' : 'rb-admin'}`}>
                                                        {a.role === 'master_admin' ? 'Master Admin' : 'Regular Admin'}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{fmtDate(a.createdAt)}</td>
                                                <td style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px' }}>{a.totalOrders || 0}</td>
                                                <td>
                                                    {isProtected
                                                        ? <span className="ma-protected-badge">🔒 Protected</span>
                                                        : (
                                                            <div className="ma-row-actions">
                                                                <button className="ma-row-btn" title="Edit" onClick={() => openEdit(a)}>
                                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                                </button>
                                                                <button className="ma-row-btn" title="Change Password" onClick={() => openPassword(a)}>
                                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                                                </button>
                                                                <button className="ma-row-btn danger" title="Remove" onClick={() => openRemove(a)}>
                                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
                                                                </button>
                                                            </div>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="ma-card" style={{ border: '1.5px solid rgba(192,57,43,0.15)' }}>
                        <div className="ma-sec-header" style={{ marginBottom: '16px' }}>
                            <div className="ma-sec-icon" style={{ background: 'var(--red-soft)', fontSize: '17px' }}>⚠️</div>
                            <div>
                                <div className="ma-sec-title" style={{ color: 'var(--red)' }}>Danger Zone</div>
                                <div className="ma-sec-sub">Irreversible actions — proceed with extreme caution</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="ma-danger-zone">
                                <div className="ma-dz-info">
                                    <strong>Revoke All Regular Admin Access</strong>
                                    <span>Immediately remove all regular admin permissions. Cannot be undone without re-assigning.</span>
                                </div>
                                <button className="ma-btn ma-btn-danger" style={{ whiteSpace: 'nowrap' }}>Revoke All</button>
                            </div>
                            <div className="ma-danger-zone">
                                <div className="ma-dz-info">
                                    <strong>Reset Admin Activity Logs</strong>
                                    <span>Permanently delete all activity log entries for all admins.</span>
                                </div>
                                <button className="ma-btn ma-btn-danger" style={{ whiteSpace: 'nowrap' }}>Clear Logs</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── LOGS TAB ── */}
            {activeTab === 'logs' && (
                <div className="ma-card">
                    <div className="ma-sec-header">
                        <div className="ma-sec-icon" style={{ background: '#F5F5F0', fontSize: '18px' }}>📜</div>
                        <div>
                            <div className="ma-sec-title">Activity Logs</div>
                            <div className="ma-sec-sub">All admin actions recorded in real time</div>
                        </div>
                        <button className="ma-btn ma-btn-ghost" style={{ marginLeft: 'auto', padding: '7px 14px', fontSize: '12px' }}>Export CSV</button>
                    </div>
                    <div>
                        {logs.length === 0 ? (
                            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-sub)', fontSize: '13px' }}>No activity logs yet.</div>
                        ) : logs.map((log, i) => (
                            <div key={log._id} className="ma-log-item">
                                <div className={`ma-log-dot ${logDotColor(log.action)}`} />
                                <div className="ma-log-text">
                                    <strong>{log.adminEmail}</strong> {log.action}
                                    {log.targetUserEmail && <> — <em>{log.targetUserEmail}</em></>}
                                    {log.details && <> · <em>{log.details}</em></>}
                                </div>
                                <div className="ma-log-time">{fmtDate(log.createdAt)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── EDIT MODAL ── */}
            <div className={`ma-overlay${editOverlay ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setEditOverlay(false); }}>
                <div className="ma-modal">
                    <div className="ma-modal-header">
                        <div className="ma-modal-title">Edit Admin</div>
                        <div className="ma-modal-sub">{editingAdmin?.email}</div>
                    </div>
                    <div className="ma-modal-body">
                        <div className="ma-form-row" style={{ marginBottom: '14px' }}>
                            <div className="ma-field">
                                <label>Full Name</label>
                                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                            </div>
                        </div>
                        <div className="ma-form-row">
                            <div className="ma-field">
                                <label>Role</label>
                                <div className="ma-select-wrap">
                                    <select value={editRole} onChange={e => setEditRole(e.target.value)}>
                                        <option value="master_admin">Master Admin</option>
                                        <option value="admin">Regular Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ma-modal-footer">
                        <button className="ma-btn ma-btn-ghost" onClick={() => setEditOverlay(false)}>Cancel</button>
                        <button className="ma-btn ma-btn-primary" onClick={saveEdit}>Save Changes</button>
                    </div>
                </div>
            </div>

            {/* ── REMOVE MODAL ── */}
            <div className={`ma-overlay${removeOverlay ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setRemoveOverlay(false); }}>
                <div className="ma-modal">
                    <div className="ma-modal-header" style={{ background: 'linear-gradient(135deg, #FFF5F5, #FFF)' }}>
                        <div className="ma-modal-title" style={{ color: 'var(--red)' }}>Remove Admin?</div>
                        <div className="ma-modal-sub">Remove admin access for {removingAdmin?.name}?</div>
                    </div>
                    <div className="ma-modal-body">
                        <p style={{ fontSize: '13px', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                            The user's account will remain active but all admin privileges will be revoked. You can re-promote them at any time.
                        </p>
                    </div>
                    <div className="ma-modal-footer">
                        <button className="ma-btn ma-btn-ghost" onClick={() => setRemoveOverlay(false)}>Cancel</button>
                        <button className="ma-btn" style={{ background: 'var(--red)', color: '#fff' }} onClick={confirmRemove}>Yes, Remove Admin</button>
                    </div>
                </div>
            </div>

            {/* ── PASSWORD MODAL ── */}
            <div className={`ma-overlay${pwOverlay ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setPwOverlay(false); }}>
                <div className="ma-modal">
                    <div className="ma-modal-header">
                        <div className="ma-modal-title">Change Password</div>
                        <div className="ma-modal-sub">{pwAdmin?.name}</div>
                    </div>
                    <div className="ma-modal-body">
                        <div className="ma-field">
                            <label>New Password</label>
                            <input type="password" placeholder="Min. 8 characters" value={pwValue} onChange={e => setPwValue(e.target.value)} />
                        </div>
                    </div>
                    <div className="ma-modal-footer">
                        <button className="ma-btn ma-btn-ghost" onClick={() => setPwOverlay(false)}>Cancel</button>
                        <button className="ma-btn ma-btn-primary" onClick={savePassword}>Save Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
