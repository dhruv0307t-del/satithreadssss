"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* =============================
     LOAD DASHBOARD DATA
  ============================== */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");

        if (!res.ok) {
          throw new Error("Dashboard fetch failed");
        }

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

  if (loading || !stats) {
    return (
      <div className="admin-layout">
        <main className="admin-main">
          <p className="text-black">Loading dashboard...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar is already in layout */}

      <main className="admin-main">
        {/* Header */}
        <div className="mb-10">
          <h1 className="admin-title">Hi Admin,</h1>
          <p className="admin-subtitle">Here’s what’s happening today</p>
        </div>

        {/* USERS section */}
        <section className="admin-section mb-10">
          <h2 style={{ fontWeight: 600, marginBottom: "24px" }}>
            Total Users {stats.totalUsers}
          </h2>

          <div className="admin-stats-grid">
            <div className="admin-metric-card">
              <p className="admin-card-title">Non-Subscribed Users</p>
              <p className="admin-card-value">
                {(Number(stats.totalUsers) || 0) - (Number(stats.subscribedUsers) || 0)}
              </p>
            </div>

            <div className="admin-metric-card">
              <p className="admin-card-title">Subscribed Users</p>
              <p
                className="admin-card-value"
                style={{ color: "#4a5d3a" }}
              >
                {stats.subscribedUsers}
              </p>
            </div>

            <div className="admin-metric-card">
              <p className="admin-card-title">New Users This Week</p>
              <p className="admin-card-value">
                {stats.newUsersThisWeek}
              </p>
            </div>
          </div>
        </section>

        {/* Other stats */}
        <section className="admin-stats-grid">
          <div className="admin-metric-card">
            <p className="admin-card-title">Total Products</p>
            <p className="admin-card-value">{stats.totalProducts}</p>
          </div>

          <div className="admin-metric-card relative group">
            <p className="admin-card-title">Low Stock Products</p>
            <p className="admin-card-value" style={{ color: stats.lowStockProducts > 0 ? "#dc2626" : "#4a5d3a" }}>
              {stats.lowStockProducts}
            </p>
            <Link
              href="/admin/inventory"
              className="absolute top-4 right-4 text-xs font-bold text-black/40 hover:text-black opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
            >
              Manage
            </Link>
          </div>

          <div className="admin-metric-card">
            <p className="admin-card-title">Total Orders</p>
            <p className="admin-card-value">{stats.totalOrders}</p>
          </div>

          <div className="admin-metric-card">
            <p className="admin-card-title">Total Revenue</p>
            <p className="admin-card-value">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
