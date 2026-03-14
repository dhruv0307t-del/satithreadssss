"use client";

import { useEffect, useState, useMemo } from "react";
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
  .kpi-badge.up { background: #E6F4EC; color: var(--green); }
  .kpi-badge.down { background: var(--red-soft); color: var(--red); }
  .kpi-badge.neutral { background: #F0F0EA; color: var(--label); }

  .chart-grid-2 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
  .chart-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  @media (max-width: 900px) {
    .chart-grid-2, .chart-grid-3 { grid-template-columns: 1fr; }
  }

  .chart-card { position: relative; }
  .chart-card .chart-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .chart-card .chart-title { font-size: 14px; font-weight: 600; color: var(--text); }
  .chart-card .chart-sub { font-size: 12px; color: var(--text-sub); margin-top: 2px; }
  .chart-wrap { position: relative; height: 220px; }
  .chart-wrap.tall { height: 260px; }

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
  .profit-table .money { font-family: 'DM Mono', monospace; font-weight: 500; color: var(--green); text-align: right; }
  .profit-table .loss-cell { color: var(--red); font-family: 'DM Mono', monospace; text-align: right; }
  .profit-table .pct { font-size: 11px; color: var(--text-sub); text-align: right; }

  .tab-group { display: flex; gap: 4px; background: var(--bg); border-radius: 99px; padding: 3px; width: fit-content; margin-bottom: 16px; }
  .tab { padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 500; cursor: pointer; color: var(--text-sub); transition: all 0.15s; border: none; background: transparent; font-family: 'DM Sans', sans-serif; }
  .tab.active { background: var(--card); color: var(--green); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

  .pay-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .pay-dot { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-sub); }
  .dot { width: 8px; height: 8px; border-radius: 50%; }

  .alert-card { border-left: 3px solid var(--red); background: linear-gradient(135deg, #FFF9F9 0%, var(--card) 100%); }
  
  .metric-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--card); border: 1px solid var(--border); border-radius: 99px;
    padding: 6px 14px; font-size: 12px; color: var(--text-sub); box-shadow: var(--shadow);
  }
  .metric-pill strong { color: var(--green); font-weight: 600; }
  .pill-row { display: flex; flex-wrap: wrap; gap: 8px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .section { animation: fadeUp 0.4s ease both; }

  @media (max-width: 600px) {
    .revenue-page-container { padding: 20px 14px 40px; }
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .header { flex-direction: column; align-items: flex-start; }
  }
`;

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fmt = (n: number) => {
    if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(0) + "K";
    return "₹" + n;
  };

  const fmtLong = (n: number) => {
    return "₹" + n.toLocaleString("en-IN");
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(26,26,20,0.95)',
        padding: 12,
        bodyFont: { family: "'DM Sans', sans-serif" },
        titleFont: { family: "'DM Sans', sans-serif" },
        callbacks: {
          label: (ctx: any) => ` ₹${ctx.raw.toLocaleString("en-IN")}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "'DM Mono', monospace", size: 10 }, color: '#7A8070' }
      },
      y: {
        grid: { color: 'rgba(58,107,80,0.05)' },
        ticks: { font: { family: "'DM Mono', monospace", size: 10 }, color: '#7A8070', callback: (v: any) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}` }
      }
    }
  };

  const monthlyTrendsData = useMemo(() => {
    if (!data?.trends || (filter !== 'month' && filter !== 'year')) return { labels: [], datasets: [] };
    return {
      labels: data.trends.map((t: any) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // Handle both old and new API formats
        const m = t._id?.month || t.label;
        return typeof m === 'number' ? months[m - 1] : m;
      }),
      datasets: [{
        label: "Monthly Revenue",
        data: data.trends.map((t: any) => t.revenue),
        borderColor: "#3A6B50",
        backgroundColor: "rgba(58,107,80,0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      }]
    };
  }, [data, filter]);

  const hourlyTrendsData = useMemo(() => {
    if (!data?.trends || filter !== 'today') return { labels: [], datasets: [] };
    return {
      labels: data.trends.map((t: any) => `${t.label}:00`),
      datasets: [{
        label: "Hourly Revenue",
        data: data.trends.map((t: any) => t.revenue),
        borderColor: "#3A6B50",
        backgroundColor: "rgba(58,107,80,0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      }]
    };
  }, [data, filter]);

  const weekTrendsData = useMemo(() => {
    if (!data?.trends || filter !== 'week') return { labels: [], datasets: [] };
    return {
      labels: data.trends.map((t: any) => t.label),
      datasets: [{
        label: "Daily Revenue",
        data: data.trends.map((t: any) => t.revenue),
        borderColor: "#3A6B50",
        backgroundColor: "rgba(58,107,80,0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      }]
    };
  }, [data, filter]);

  const categoryData = useMemo(() => {
    if (!data?.categoryRevenue) return { labels: [], datasets: [] };
    return {
      labels: data.categoryRevenue.map((c: any) => c._id),
      datasets: [{
        data: data.categoryRevenue.map((c: any) => c.revenue),
        backgroundColor: ["#3A6B50", "#5DA87A", "#8FC9A8", "#B8DEC9", "#9B6B3A"],
        borderWidth: 0,
      }]
    };
  }, [data]);

  const paymentData = useMemo(() => {
    if (!data?.paymentMethods) return { labels: [], datasets: [] };
    return {
      labels: data.paymentMethods.map((p: any) => p._id),
      datasets: [{
        data: data.paymentMethods.map((p: any) => p.revenue),
        backgroundColor: ["#3A6B50", "#B8DEC9"],
        borderWidth: 0,
      }]
    };
  }, [data]);

  const cityData = useMemo(() => {
    if (!data?.cityRevenue) return { labels: [], datasets: [] };
    return {
      labels: data.cityRevenue.map((c: any) => c._id),
      datasets: [{
        data: data.cityRevenue.map((c: any) => c.revenue),
        backgroundColor: "rgba(58,107,80,0.12)",
        hoverBackgroundColor: "#3A6B50",
        borderRadius: 12,
        barThickness: 32,
      }]
    };
  }, [data]);

  const getGrowth = (curr: number, prev: number) => {
    if (!prev) return "+100%";
    const diff = ((curr - prev) / prev) * 100;
    return `${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`;
  };

  if (loading && !data) return <div style={{ background: '#F2EFE0', height: '100vh', padding: '20px' }}>Loading...</div>;
  if (!data) return null;

  const periodLabel = filter.charAt(0).toUpperCase() + filter.slice(1);
  const comparisonLabel = filter === 'today' ? 'yesterday' : `last ${filter}`;

  return (
    <div className="revenue-page-container">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className="header">
        <div className="header-left">
          <h1>Revenue</h1>
          <p>Last updated: recently · All figures in Indian Rupees (₹)</p>
        </div>
        <div className="filter-bar">
          {["Today", "Week", "Month", "Year"].map(v => (
            <button
              key={v}
              className={`filter-btn ${filter === v.toLowerCase() ? "active" : ""}`}
              onClick={() => setFilter(v.toLowerCase())}
            >
              {v === "Month" || v === "Year" || v === "Week" ? "This " + v : v}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">Core Revenue KPIs ({periodLabel})</div>
        <div className="kpi-grid">
          <KPICard
            label={`${periodLabel} Revenue`}
            value={fmtLong(data.revenue)}
            badge={`${getGrowth(data.revenue, data.prevRevenue)} vs ${comparisonLabel}`}
          />
          <KPICard
            label={`${periodLabel} Orders`}
            value={data.orders?.toLocaleString()}
            badge={`${getGrowth(data.orders, data.prevOrders)} vs ${comparisonLabel}`}
          />
          <KPICard label="Total Revenue (All Time)" value={fmtLong(data.totalRevenue)} isBaseline />
          <KPICard label="Total Orders (All Time)" value={data.totalOrders?.toLocaleString()} isBaseline />
          <KPICard label="Avg Order Value" value={fmtLong(data.orders > 0 ? Math.round(data.revenue / data.orders) : 0)} />
          <KPICard label="Conversion Rate" value={`${data.customerStats?.conversionRate || 0}%`} />
          <KPICard label="Refunded Amount" value={fmtLong(data.refunded || 0)} isAlert />
          <KPICard label="Revenue per Visitor" value="₹70" badge="+9% vs last month" />
        </div>
      </div>

      <div className="section">
        <div className="section-title">{periodLabel} Performance Trends</div>
        <div className="chart-grid-2">
          {/* Main Distribution Chart */}
          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Revenue Distribution</div>
                <div className="chart-sub">
                  Analytics · {filter === 'today' ? 'Hourly' : filter === 'week' ? 'Daily' : 'Monthly'}
                </div>
              </div>
            </div>
            <div className="chart-wrap tall">
              {filter === 'today' && <Line data={hourlyTrendsData} options={chartOptions} />}
              {filter === 'week' && <Line data={weekTrendsData} options={chartOptions} />}
              {(filter === 'month' || filter === 'year') && <Line data={monthlyTrendsData} options={chartOptions} />}
            </div>
          </div>

          {/* Location Bar Chart */}
          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Revenue by Location</div>
                <div className="chart-sub">Geographic breakdown for {periodLabel}</div>
              </div>
            </div>
            <div className="chart-wrap tall">
              <Bar data={cityData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">{periodLabel} Breakdown</div>
        <div className="chart-grid-3">
          <div className="card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Top Products</div>
                <div className="chart-sub">By revenue ({filter})</div>
              </div>
            </div>
            <div className="rank-list">
              {data.topProducts?.length > 0 ? data.topProducts.map((p: any, i: number) => (
                <div key={p._id} className="rank-item">
                  <div className="rank-num">{i + 1}</div>
                  <div className="rank-bar-wrap">
                    <div className="rank-name">{p._id}</div>
                    <div className="rank-bar">
                      <motion.div
                        className="rank-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.revenue / (data.topProducts[0]?.revenue || 1) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="rank-val">{fmt(p.revenue)}</div>
                </div>
              )) : <div style={{ padding: '20px', color: 'var(--text-sub)' }}>No data for this period</div>}
            </div>
          </div>

          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Category Revenue</div>
                <div className="chart-sub">Period distribution</div>
              </div>
            </div>
            <div className="chart-wrap small">
              <Doughnut data={categoryData} options={{ ...chartOptions, cutout: '70%' }} />
            </div>
          </div>

          <div className="card chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Payment Methods</div>
                <div className="chart-sub">Period distribution</div>
              </div>
            </div>
            <div className="chart-wrap small">
              <Doughnut data={paymentData} options={{ ...chartOptions, cutout: '70%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Profit Metrics ({periodLabel})</div>
        <div className="chart-grid-2">
          <div className="card">
            <div className="chart-header">
              <div className="chart-title">P&L Summary (Estimated)</div>
            </div>
            <table className="profit-table">
              <thead>
                <tr><th>Metric</th><th style={{ textAlign: 'right' }}>Amount</th><th style={{ textAlign: 'right' }}>% of Revenue</th></tr>
              </thead>
              <tbody>
                <tr><td>Gross Revenue</td><td className="money">{fmtLong(data.revenue)}</td><td className="pct">100%</td></tr>
                <tr><td>Discounts & Returns</td><td className="loss-cell">-{fmtLong(data.refunded || 0)}</td><td className="pct">{(data.revenue > 0 ? (data.refunded / data.revenue * 100) : 0).toFixed(1)}%</td></tr>
                <tr><td>Net Revenue</td><td className="money">{fmtLong(data.revenue - (data.refunded || 0))}</td><td className="pct">{(data.revenue > 0 ? ((1 - (data.refunded / data.revenue)) * 100) : 0).toFixed(1)}%</td></tr>
                <tr><td>Est. COGS (45%)</td><td className="loss-cell">-{fmtLong(Math.round(data.revenue * 0.45))}</td><td className="pct">45%</td></tr>
                <tr><td>Gross Profit</td><td className="money">{fmtLong(Math.round(data.revenue * 0.55))}</td><td className="pct">55%</td></tr>
                <tr><td style={{ fontWeight: 700 }}>Net Profit (35%)</td><td className="money" style={{ fontWeight: 700, fontSize: '15px' }}>{fmtLong(Math.round(data.revenue * 0.35))}</td><td className="pct" style={{ fontWeight: 700, color: '#3A6B50' }}>35%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <KPICard label="New Customers" value={data.customerStats?.newCustomers || 0} />
            <KPICard label="Returning Customers" value={data.customerStats?.returningCustomers || 0} />
            <KPICard label="Revenue per Customer" value={fmtLong(data.customerStats?.totalUsers > 0 ? Math.round(data.revenue / data.customerStats?.totalUsers) : 0)} />
            <KPICard label="LTV Estimate" value={fmtLong(data.customerStats?.totalUsers > 0 ? Math.round(data.revenue / data.customerStats?.totalUsers * 4) : 0)} />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Advanced Metrics ({periodLabel})</div>
        <div className="pill-row">
          <div className="metric-pill">Revenue / Visitor <strong>₹70</strong></div>
          <div className="metric-pill">CAC <strong>₹320</strong></div>
          <div className="metric-pill">LTV <strong>{fmtLong(data.customerStats?.totalUsers > 0 ? Math.round(data.revenue / data.customerStats?.totalUsers * 4) : 0)}</strong></div>
          <div className="metric-pill">Gross Margin <strong>55%</strong></div>
          <div className="metric-pill">Net Margin <strong>35%</strong></div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, badge, isBaseline, isAlert }: any) {
  return (
    <div className={`card kpi-card ${isAlert ? "alert-card" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${isAlert ? "loss" : ""}`}>{value}</div>
      {badge && <div className="kpi-badge up">{badge}</div>}
      {isBaseline && <div className="kpi-badge neutral">— baseline</div>}
    </div>
  );
}
// version-sync-1773420245
