"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Dashboard fetch failed");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const userName = session?.user?.name?.split(" ")[0] || "Admin";

  const totalProducts = stats?.totalProducts ?? 0;
  const lowStockProducts = stats?.lowStockProducts ?? 0;
  const inStockPct = totalProducts > 0 ? Math.round(((totalProducts - lowStockProducts) / totalProducts) * 100) : 0;
  const lowStockPct = totalProducts > 0 ? Math.round((lowStockProducts / totalProducts) * 100) : 0;

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-header">
        <div>
          <div className="adm-greeting-label">{today}</div>
          <div className="adm-greeting-title">
            Hi, <span>{userName}</span>
          </div>
          <div className="adm-greeting-sub">Here&apos;s what&apos;s happening today.</div>
        </div>
        <div className="adm-status-chip">⚡ All systems operational</div>
      </div>

      {/* User Overview */}
      <div className="adm-section-title">User Overview</div>
      <div className="adm-stats-grid adm-stats-3">
        <div className="adm-stat-card" style={{ animationDelay: "0.05s" }}>
          <div className="adm-stat-label">Total Users</div>
          {loading ? (
            <div className="adm-skeleton" style={{ height: 52, width: 80 }} />
          ) : (
            <div className="adm-stat-value">{stats?.totalUsers ?? 0}</div>
          )}
          <div className="adm-stat-change">↑ Active this week</div>
        </div>

        <div className="adm-stat-card" style={{ animationDelay: "0.1s" }}>
          <div className="adm-stat-label">Subscribed Users</div>
          {loading ? (
            <div className="adm-skeleton" style={{ height: 52, width: 80 }} />
          ) : (
            <div className="adm-stat-value">{stats?.subscribedUsers ?? 0}</div>
          )}
          <div className="adm-stat-change neutral">Newsletter subscribers</div>
        </div>

        <div className="adm-stat-card highlight" style={{ animationDelay: "0.15s" }}>
          <div className="adm-stat-label">New Users This Week</div>
          {loading ? (
            <div className="adm-skeleton" style={{ height: 52, width: 80, opacity: 0.3 }} />
          ) : (
            <div className="adm-stat-value">{stats?.newUsersThisWeek ?? 0}</div>
          )}
          <div className="adm-stat-change">↑ Last 7 days</div>
        </div>
      </div>

      {/* Orders & Revenue */}
      <div className="adm-section-title">Orders &amp; Revenue</div>
      <div className="adm-stats-grid adm-stats-2" style={{ marginBottom: 40 }}>
        <div className="adm-stat-card" style={{ animationDelay: "0.2s" }}>
          <div className="adm-stat-label">Total Orders</div>
          {loading ? (
            <div className="adm-skeleton" style={{ height: 44, width: 60 }} />
          ) : (
            <div className="adm-stat-value" style={{ fontSize: 40 }}>{stats?.totalOrders ?? 0}</div>
          )}
          <div className="adm-stat-change">All time orders</div>
        </div>
        <div className="adm-stat-card" style={{ animationDelay: "0.25s" }}>
          <div className="adm-stat-label">Total Revenue</div>
          {loading ? (
            <div className="adm-skeleton" style={{ height: 44, width: 120 }} />
          ) : (
            <div className="adm-stat-value" style={{ fontSize: 36 }}>
              ₹{(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}
            </div>
          )}
          <div className="adm-stat-change">From paid orders</div>
        </div>
      </div>

      {/* Products & Inventory */}
      <div className="adm-section-title">Products &amp; Inventory</div>
      <div className="adm-stats-grid adm-stats-2">
        <div className="adm-stat-card" style={{ animationDelay: "0.3s" }}>
          <div className="adm-stat-label">Total Products</div>
          {loading ? (
            <div className="adm-skeleton" style={{ height: 44, width: 60 }} />
          ) : (
            <div className="adm-stat-value" style={{ fontSize: 40 }}>{totalProducts}</div>
          )}
          <div className="adm-bar-row">
            <span className="adm-bar-tag">In stock</span>
            <div className="adm-bar-track">
              <div className="adm-bar-fill" style={{ width: `${inStockPct}%` }} />
            </div>
            <span className="adm-bar-pct">{inStockPct}%</span>
          </div>
        </div>

        <div className="adm-stat-card" style={{ animationDelay: "0.35s" }}>
          <div className="adm-stat-label">Low Stock Products</div>
          {loading ? (
            <div className="adm-skeleton" style={{ height: 44, width: 60 }} />
          ) : (
            <div className="adm-stat-value" style={{ fontSize: 40, color: "var(--adm-accent2)" }}>
              {lowStockProducts}
            </div>
          )}
          <div className="adm-bar-row">
            <span className="adm-bar-tag">Critical</span>
            <div className="adm-bar-track">
              <div className="adm-bar-fill alt" style={{ width: `${lowStockPct}%` }} />
            </div>
            <span className="adm-bar-pct" style={{ color: "var(--adm-accent2)" }}>{lowStockPct}%</span>
          </div>
          <Link
            href="/admin/inventory"
            className="adm-manage-link"
          >
            Manage inventory →
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: 16 }}>
        <div className="adm-stat-card" style={{ animationDelay: "0.4s" }}>
          <div className="adm-stat-label">Contact Messages</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            {loading ? (
              <div className="adm-skeleton" style={{ height: 44, width: 60 }} />
            ) : (
              <>
                <div className="adm-stat-value" style={{ fontSize: 40 }}>
                  {stats?.contactMessages ?? 0}
                </div>
                {(stats?.newContactMessages ?? 0) > 0 && (
                  <span className="adm-badge-new">
                    {stats.newContactMessages} new
                  </span>
                )}
              </>
            )}
          </div>
          <Link href="/admin/contact-messages" className="adm-manage-link">
            View messages →
          </Link>
        </div>
      </div>
    </div>
  );
}
