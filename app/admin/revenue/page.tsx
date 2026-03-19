"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GLOBAL_CSS = `
  :root {
    --bg: #F2EFE0;
    --card: #FFFFFF;
    --green: #3A6B50;
    --green-light: #4D8C6A;
    --green-muted: #5A8F72;
    --label: #7A8070;
    --text: #1A1A14;
    --text-sub: #6B7060;
    --border: rgba(58,107,80,0.10);
    --shadow: 0 2px 16px rgba(40,60,40,0.07), 0 1px 3px rgba(40,60,40,0.05);
    --shadow-lg: 0 8px 32px rgba(40,60,40,0.10), 0 2px 8px rgba(40,60,40,0.06);
    --red: #C0392B;
    --red-soft: #FDECEA;
    --amber: #C07A20;
    --amber-soft: #FEF3E2;
    --radius: 18px;
    --radius-sm: 12px;
  }

  .revenue-page-container {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding: 40px 32px 60px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
  .header-left h1 { font-size: 36px; font-weight: 700; letter-spacing: -1px; color: var(--text); line-height: 1; }
  .header-left p { font-size: 13px; color: var(--text-sub); margin-top: 5px; }

  .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .filter-btn {
    padding: 8px 16px; border-radius: 99px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s;
    border: 1.5px solid var(--border); background: var(--card); color: var(--text-sub);
  }
  .filter-btn:hover { border-color: var(--green); color: var(--green); }
  .filter-btn.active { background: var(--green); color: #fff; border-color: var(--green); }

  .section { margin-bottom: 36px; }
  .section-title {
    font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--label); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .card {
    background: var(--card); border-radius: var(--radius); padding: 22px 24px;
    box-shadow: var(--shadow); border: 1px solid rgba(255,255,255,0.8);
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .card:hover { box-shadow: var(--shadow-lg); transform: translateY(-1px); }

  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
  .kpi-card .kpi-label {
    font-size: 10px; font-weight: 600; letter-spacing: 1.4px; text-transform: uppercase;
    color: var(--label); margin-bottom: 10px;
  }
  .kpi-card .kpi-value {
    font-size: 32px; font-weight: 700; color: var(--green); letter-spacing: -1px;
    line-height: 1; font-family: 'DM Sans', sans-serif;
  }
  .kpi-card .kpi-value.loss { color: var(--red); }
  .kpi-card .kpi-badge {
    display: inline-flex; align-items: center; gap: 3px; margin-top: 8px;
    font-size: 12px; font-weight: 500; padding: 3px 8px; border-radius: 99px;
  }
  .kpi-badge.up   { background: #E6F4EC; color: var(--green); }
  .kpi-badge.down { background: var(--red-soft); color: var(--red); }
  .kpi-badge.neutral { background: #F0F0EA; color: var(--label); }

  .chart-grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .chart-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .kpi-grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  @media (max-width: 900px) {
    .chart-grid-2, .chart-grid-3, .kpi-grid-2x2 { grid-template-columns: 1fr; }
  }

  .chart-card { position: relative; }
  .chart-card .chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .chart-card .chart-title { font-size: 14px; font-weight: 600; color: var(--text); }
  .chart-card .chart-sub { font-size: 12px; color: var(--text-sub); margin-top: 2px; }

  /* ✅ FIX 6: added missing .small height */
  .chart-wrap        { position: relative; height: 220px; }
  .chart-wrap.tall   { height: 260px; }
  .chart-wrap.small  { height: 180px; }

  .rank-list { display: flex; flex-direction: column; gap: 10px; }
  .rank-item { display: flex; align-items: center; gap: 12px; }
  .rank-num { font-size: 11px; font-weight: 600; color: var(--label); width: 18px; text-align: center; }
  .rank-bar-wrap { flex: 1; }
  .rank-name { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 4px; }
  .rank-bar { height: 5px; border-radius: 99px; background: #EBF4EF; overflow: hidden; }
  .rank-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--green), var(--green-light)); transition: width 1s cubic-bezier(.4,0,.2,1); }
  .rank-val { font-size: 13px; font-weight: 600; color: var(--green); min-width: 72px; text-align: right; font-family: 'DM Mono', monospace; }

  .profit-table { width: 100%; border-collapse: collapse; }
  .profit-table th, .profit-table td { padding: 10px 0; font-size: 13px; }
  .profit-table th { font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--label); font-weight: 600; border-bottom: 1px solid var(--border); }
  .profit-table td { border-bottom: 1px solid rgba(58,107,80,0.06); }
  .profit-table tr:last-child td { border-bottom: none; font-weight: 700; }
  .profit-table .money     { font-family: 'DM Mono', monospace; font-weight: 500; color: var(--green); text-align: right; }
  .profit-table .loss-cell { color: var(--red); font-family: 'DM Mono', monospace; text-align: right; }
  .profit-table .pct       { font-size: 11px; color: var(--text-sub); text-align: right; }

  .alert-card { border-left: 3px solid var(--red); background: linear-gradient(135deg, #FFF9F9 0%, var(--card) 100%); }

  .metric-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--card); border: 1px solid var(--border); border-radius: 99px;
    padding: 6px 14px; font-size: 12px; color: var(--text-sub); box-shadow: var(--shadow);
  }
  .metric-pill strong { color: var(--green); font-weight: 600; }
  .pill-row { display: flex; flex-wrap: wrap; gap: 8px; }

  .loading-shimmer {
    background: linear-gradient(90deg, #eee 25%, #f5f5f0 50%, #eee 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--radius-sm);
    height: 80px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .section { animation: fadeUp 0.4s ease both; }

  @media (max-width: 600px) {
    .revenue-page-container { padding: 20px 14px 40px; }
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .header { flex-direction: column; align-items: flex-start; }
  }
`;

const PALETTE = ["#3A6B50", "#5DA87A", "#8FC9A8", "#B8DEC9", "#9B6B3A", "#D4956A", "#3A5D6B", "#6A9BB0"];

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month");

  // ✅ FIX 1 + 2: re-fetch whenever filter changes, pass period as query param
  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/revenue?period=${filter}`)
      .then(res => res.json())
      .then(resData => { setData(resData); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmt = (n: number) => {
    if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
    return "₹" + n;
  };
  const fmtLong = (n: number) => "₹" + (n || 0).toLocaleString("en-IN");

  const getGrowth = (curr: number, prev: number) => {
    if (!prev && !curr) return { label: "— no data", cls: "neutral" };
    if (!prev) return { label: "+100%", cls: "up" };
    const diff = ((curr - prev) / prev) * 100;
    return {
      label: `${diff > 0 ? "+" : ""}${diff.toFixed(0)}% vs ${comparisonLabel}`,
      cls: diff >= 0 ? "up" : "down",
    };
  };

  const periodLabel = filter.charAt(0).toUpperCase() + filter.slice(1);
  const comparisonLabel = filter === "today" ? "yesterday" : `last ${filter}`;

  // ── Chart base options ────────────────────────────────────────────────────
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(26,26,20,0.95)",
        padding: 12,
        bodyFont: { family: "'DM Sans', sans-serif" },
        titleFont: { family: "'DM Sans', sans-serif" },
        callbacks: { label: (ctx: any) => ` ₹${ctx.raw.toLocaleString("en-IN")}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "'DM Mono', monospace", size: 10 }, color: "#7A8070" },
      },
      y: {
        grid: { color: "rgba(58,107,80,0.05)" },
        ticks: {
          font: { family: "'DM Mono', monospace", size: 10 },
          color: "#7A8070",
          callback: (v: any) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`,
        },
      },
    },
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(26,26,20,0.95)",
        callbacks: { label: (ctx: any) => ` ₹${ctx.raw.toLocaleString("en-IN")}` },
      },
    },
  };

  // ── Memoised chart datasets ───────────────────────────────────────────────
  const trendChartData = useMemo(() => {
    if (!data?.trends?.length) return { labels: [], datasets: [] };
    return {
      labels: data.trends.map((t: any) => t.label),
      datasets: [{
        label: "Revenue",
        data: data.trends.map((t: any) => t.revenue),
        borderColor: "#3A6B50",
        backgroundColor: "rgba(58,107,80,0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
      }],
    };
  }, [data]);

  const categoryChartData = useMemo(() => {
    if (!data?.categoryRevenue?.length) return { labels: [], datasets: [] };
    return {
      labels: data.categoryRevenue.map((c: any) => c._id),
      datasets: [{
        data: data.categoryRevenue.map((c: any) => c.revenue),
        backgroundColor: PALETTE,
        borderWidth: 0,
        hoverOffset: 6,
      }],
    };
  }, [data]);

  const paymentChartData = useMemo(() => {
    if (!data?.paymentMethods?.length) return { labels: [], datasets: [] };
    return {
      labels: data.paymentMethods.map((p: any) => p._id),
      datasets: [{
        data: data.paymentMethods.map((p: any) => p.revenue),
        backgroundColor: PALETTE,
        borderWidth: 0,
        hoverOffset: 6,
      }],
    };
  }, [data]);

  const cityChartData = useMemo(() => {
    if (!data?.cityRevenue?.length) return { labels: [], datasets: [] };
    return {
      labels: data.cityRevenue.map((c: any) => c._id),
      datasets: [{
        data: data.cityRevenue.map((c: any) => c.revenue),
        backgroundColor: "rgba(58,107,80,0.12)",
        hoverBackgroundColor: "#3A6B50",
        borderRadius: 10,
        barThickness: 28,
      }],
    };
  }, [data]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="revenue-page-container">
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <div className="kpi-grid" style={{ marginTop: 40 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="loading-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const revenueGrowth = getGrowth(data.revenue, data.prevRevenue);
  const ordersGrowth = getGrowth(data.orders, data.prevOrders);
  const netRevenue = data.revenue - (data.refunded || 0);
  const cogs = Math.round(data.revenue * 0.45);
  const grossProfit = data.revenue - cogs;
  const netProfit = Math.round(data.revenue * 0.35);
  const refundPct = data.revenue > 0 ? ((data.refunded / data.revenue) * 100).toFixed(1) : "0.0";

  return (
    <div className="revenue-page-container">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ── Header ── */}
      <div className="header">
        <div className="header-left">
          <h1>Revenue</h1>
          <p>
            {loading ? "Refreshing…" : "Last updated: just now"} · All figures in ₹
          </p>
        </div>
        <div className="filter-bar">
          {[
            { label: "Today", value: "today" },
            { label: "This Week", value: "week" },
            { label: "This Month", value: "month" },
            { label: "This Year", value: "year" },
          ].map(f => (
            <button
              key={f.value}
              className={`filter-btn ${filter === f.value ? "active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="section">
        <div className="section-title">Core KPIs — {periodLabel}</div>
        <div className="kpi-grid">
          <KPICard
            label={`Revenue (${periodLabel})`}
            value={fmtLong(data.revenue)}
            badge={revenueGrowth.label}
            badgeCls={revenueGrowth.cls}
          />
          <KPICard
            label={`Orders (${periodLabel})`}
            value={(data.orders || 0).toLocaleString()}
            badge={ordersGrowth.label}
            badgeCls={ordersGrowth.cls}
          />
          <KPICard label="All-Time Revenue" value={fmtLong(data.totalRevenue)} isBaseline />
          <KPICard label="All-Time Orders" value={(data.totalOrders || 0).toLocaleString()} isBaseline />
          <KPICard
            label="Avg Order Value"
            value={data.orders > 0 ? fmtLong(Math.round(data.revenue / data.orders)) : "₹0"}
          />
          <KPICard
            label="Conversion Rate"
            value={`${data.customerStats?.conversionRate ?? "0.0"}%`}
            badge="orders ÷ total users"
            badgeCls="neutral"
          />
          <KPICard
            label="Refunded Amount"
            value={fmtLong(data.refunded || 0)}
            isAlert
            badge={`${refundPct}% of revenue`}
            badgeCls="down"
          />
          <KPICard
            label="Net Revenue"
            value={fmtLong(netRevenue)}
            badge="after refunds"
            badgeCls="neutral"
          />
        </div>
      </div>

      {/* ── Trends + City ── */}
      <div className="section">
        <div className="section-title">Revenue Trends — {periodLabel}</div>
        <div className="chart-grid-2">
          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Revenue Over Time</div>
                <div className="chart-sub">
                  {filter === "today" ? "Hourly" : filter === "week" ? "Daily" : filter === "month" ? "Daily (this month)" : "Monthly"}
                </div>
              </div>
            </div>
            <div className="chart-wrap tall">
              {trendChartData.labels.length > 0
                ? <Line data={trendChartData} options={chartOptions} />
                : <EmptyChart />
              }
            </div>
          </div>

          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Revenue by City</div>
                <div className="chart-sub">Top 8 cities — {periodLabel}</div>
              </div>
            </div>
            <div className="chart-wrap tall">
              {cityChartData.labels.length > 0
                ? <Bar data={cityChartData} options={chartOptions} />
                : <EmptyChart />
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── Breakdown ── */}
      <div className="section">
        <div className="section-title">Revenue Breakdown — {periodLabel}</div>
        <div className="chart-grid-3">

          {/* Top products */}
          <div className="card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Top Products</div>
                <div className="chart-sub">By revenue</div>
              </div>
            </div>
            <div className="rank-list">
              {data.topProducts?.length > 0 ? (
                data.topProducts.map((p: any, i: number) => (
                  <div key={p._id} className="rank-item">
                    <div className="rank-num">{i + 1}</div>
                    <div className="rank-bar-wrap">
                      <div className="rank-name">{p._id}</div>
                      <div className="rank-bar">
                        <motion.div
                          className="rank-fill"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(p.revenue / (data.topProducts[0]?.revenue || 1)) * 100}%`,
                          }}
                          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        />
                      </div>
                    </div>
                    <div className="rank-val">{fmt(p.revenue)}</div>
                  </div>
                ))
              ) : (
                <EmptyChart label="No product sales in this period" />
              )}
            </div>
          </div>

          {/* Category doughnut */}
          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">By Category</div>
                <div className="chart-sub">Revenue share</div>
              </div>
            </div>
            <div className="chart-wrap small">
              {categoryChartData.labels.length > 0
                ? <Doughnut data={categoryChartData} options={doughnutOptions} />
                : <EmptyChart />
              }
            </div>
            <ColorLegend items={categoryChartData.labels as string[]} />
          </div>

          {/* Payment doughnut */}
          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Payment Methods</div>
                <div className="chart-sub">Revenue share</div>
              </div>
            </div>
            <div className="chart-wrap small">
              {paymentChartData.labels.length > 0
                ? <Doughnut data={paymentChartData} options={doughnutOptions} />
                : <EmptyChart />
              }
            </div>
            <ColorLegend items={paymentChartData.labels as string[]} />
          </div>
        </div>
      </div>

      {/* ── P&L + Customer metrics ── */}
      <div className="section">
        <div className="section-title">Profit & Customer Metrics — {periodLabel}</div>
        <div className="chart-grid-2">

          {/* P&L table */}
          <div className="card">
            <div className="chart-header">
              <div className="chart-title">P&amp;L Summary (Estimated)</div>
            </div>
            <table className="profit-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th style={{ textAlign: "right" }}>% of Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gross Revenue</td>
                  <td className="money">{fmtLong(data.revenue)}</td>
                  <td className="pct">100%</td>
                </tr>
                <tr>
                  <td>Refunds &amp; Returns</td>
                  <td className="loss-cell">-{fmtLong(data.refunded || 0)}</td>
                  <td className="pct">{refundPct}%</td>
                </tr>
                <tr>
                  <td>Net Revenue</td>
                  <td className="money">{fmtLong(netRevenue)}</td>
                  <td className="pct">
                    {data.revenue > 0 ? ((netRevenue / data.revenue) * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
                <tr>
                  <td>Est. COGS (45%)</td>
                  <td className="loss-cell">-{fmtLong(cogs)}</td>
                  <td className="pct">45%</td>
                </tr>
                <tr>
                  <td>Gross Profit</td>
                  <td className="money">{fmtLong(grossProfit)}</td>
                  <td className="pct">
                    {data.revenue > 0 ? ((grossProfit / data.revenue) * 100).toFixed(1) : "0.0"}%
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Net Profit (est. 35%)</td>
                  <td className="money" style={{ fontWeight: 700, fontSize: 15 }}>
                    {fmtLong(netProfit)}
                  </td>
                  <td className="pct" style={{ fontWeight: 700, color: "var(--green)" }}>35%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customer KPIs — ✅ FIX: now uses real newCustomers/returningCustomers */}
          <div className="kpi-grid-2x2">
            <KPICard
              label="New Customers"
              value={(data.customerStats?.newCustomers ?? 0).toLocaleString()}
            />
            <KPICard
              label="Returning Customers"
              value={(data.customerStats?.returningCustomers ?? 0).toLocaleString()}
            />
            <KPICard
              label="Rev / Customer"
              value={
                data.customerStats?.totalUsers > 0
                  ? fmtLong(Math.round(data.revenue / data.customerStats.totalUsers))
                  : "₹0"
              }
            />
            <KPICard
              label="Est. LTV (4×)"
              value={
                data.customerStats?.totalUsers > 0
                  ? fmtLong(Math.round((data.revenue / data.customerStats.totalUsers) * 4))
                  : "₹0"
              }
            />
          </div>
        </div>
      </div>

      {/* ── Advanced pills ── */}
      <div className="section">
        <div className="section-title">Advanced Metrics — {periodLabel}</div>
        <div className="pill-row">
          <div className="metric-pill">Gross Margin <strong>55%</strong></div>
          <div className="metric-pill">Net Margin <strong>35%</strong></div>
          <div className="metric-pill">
            Conversion Rate{" "}
            <strong>{data.customerStats?.conversionRate ?? "0.0"}%</strong>
          </div>
          <div className="metric-pill">
            Total Users <strong>{(data.customerStats?.totalUsers ?? 0).toLocaleString()}</strong>
          </div>
          <div className="metric-pill">
            Net Revenue <strong>{fmtLong(netRevenue)}</strong>
          </div>
          <div className="metric-pill">
            Est. Profit <strong>{fmtLong(netProfit)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KPICard({ label, value, badge, badgeCls = "up", isBaseline, isAlert }: any) {
  return (
    <div className={`card kpi-card ${isAlert ? "alert-card" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${isAlert ? "loss" : ""}`}>{value ?? "—"}</div>
      {badge && (
        <div className={`kpi-badge ${isBaseline ? "neutral" : badgeCls}`}>{badge}</div>
      )}
      {isBaseline && !badge && (
        <div className="kpi-badge neutral">— baseline</div>
      )}
    </div>
  );
}

function ColorLegend({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
      {items.map((item, i) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-sub)" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE[i % PALETTE.length] }} />
          {item}
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ label = "No data for this period" }: { label?: string }) {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-sub)", fontSize: 13 }}>
      {label}
    </div>
  );
}