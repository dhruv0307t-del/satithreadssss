"use client";

import { useEffect, useState } from "react";

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="admin-main text-black">
      <h1 className="admin-title mb-10">Revenue</h1>

      <div className="admin-stats-grid">
        <div className="admin-metric-card">
          <p className="admin-card-title">Total Revenue</p>
          <p className="admin-card-value">₹{data.totalRevenue}</p>
        </div>

        <div className="admin-metric-card">
          <p className="admin-card-title">Total Orders</p>
          <p className="admin-card-value">{data.totalOrders}</p>
        </div>

        <div className="admin-metric-card">
          <p className="admin-card-title">Avg Order Value</p>
          <p className="admin-card-value">₹{data.avgOrderValue}</p>
        </div>
      </div>
    </div>
  );
}
