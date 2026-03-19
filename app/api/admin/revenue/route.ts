import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Order from "@/app/models/Order";
import User from "@/app/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      ((session.user as any).role !== "admin" &&
        (session.user as any).role !== "master_admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // ✅ FIX 1: read period param

    const now = new Date();

    // ── Current period boundaries ──────────────────────────────────────────
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

    // ── Comparison period boundaries ───────────────────────────────────────
    const yesterdayStart = new Date(startOfToday);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(endOfToday);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    const prevWeekStart = new Date(startOfWeek);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(startOfWeek);
    prevWeekEnd.setMilliseconds(-1);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
    const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

    // ── Pick correct filters ───────────────────────────────────────────────
    let dateFilter: any = {};
    let comparisonFilter: any = {};

    switch (period) {
      case "today":
        dateFilter = { createdAt: { $gte: startOfToday, $lte: endOfToday } };
        comparisonFilter = { createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } };
        break;
      case "week":
        dateFilter = { createdAt: { $gte: startOfWeek, $lte: endOfToday } };
        comparisonFilter = { createdAt: { $gte: prevWeekStart, $lte: prevWeekEnd } };
        break;
      case "year":
        dateFilter = { createdAt: { $gte: startOfYear, $lte: endOfToday } };
        comparisonFilter = { createdAt: { $gte: lastYearStart, $lte: lastYearEnd } };
        break;
      case "month":
      default:
        dateFilter = { createdAt: { $gte: startOfMonth, $lte: endOfToday } };
        comparisonFilter = { createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } };
        break;
    }

    // ── Core metrics ──────────────────────────────────────────────────────
    const [currentMetrics, comparisonMetrics] = await Promise.all([
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" },
            orders: { $count: {} },
            // ✅ FIX 2: only count genuinely refunded/cancelled orders
            refunded: {
              $sum: {
                $cond: [
                  { $in: ["$orderStatus", ["cancelled", "refunded"]] },
                  "$totalAmount",
                  0,
                ],
              },
            },
          },
        },
      ]),
      Order.aggregate([
        { $match: comparisonFilter },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" },
            orders: { $count: {} },
          },
        },
      ]),
    ]);

    const curr = currentMetrics[0] || { revenue: 0, orders: 0, refunded: 0 };
    const prev = comparisonMetrics[0] || { revenue: 0, orders: 0 };

    // ── Trends (grouped correctly per period) ─────────────────────────────
    // ✅ FIX 3: week now groups by actual calendar date string, not day-of-month
    let trendPipeline: any[] = [];

    if (period === "today") {
      trendPipeline = [
        { $match: dateFilter },
        { $group: { _id: { hour: { $hour: "$createdAt" } }, revenue: { $sum: "$totalAmount" } } },
        { $sort: { "_id.hour": 1 } },
        {
          $project: {
            label: { $toString: "$_id.hour" }, // "0" … "23"
            revenue: 1,
          },
        },
      ];
    } else if (period === "week") {
      trendPipeline = [
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
              dow: { $dayOfWeek: "$createdAt" }, // 1=Sun … 7=Sat
            },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        {
          $project: {
            // "Mon 10", "Tue 11" etc.
            label: {
              $concat: [
                {
                  $arrayElemAt: [
                    ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    "$_id.dow",
                  ],
                },
                " ",
                { $toString: "$_id.day" },
              ],
            },
            revenue: 1,
          },
        },
      ];
    } else if (period === "month") {
      const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      trendPipeline = [
        { $match: dateFilter },
        {
          $group: {
            _id: { day: { $dayOfMonth: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.day": 1 } },
        {
          $project: {
            label: { $toString: "$_id.day" }, // "1" … "31"
            revenue: 1,
          },
        },
      ];
    } else {
      // year → group by month
      trendPipeline = [
        { $match: dateFilter },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.month": 1 } },
        {
          $project: {
            label: {
              $arrayElemAt: [
                ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                { $subtract: ["$_id.month", 1] },
              ],
            },
            revenue: 1,
          },
        },
      ];
    }

    const trends = await Order.aggregate(trendPipeline);

    // ── Top Products ──────────────────────────────────────────────────────
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          unitsSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // ── Category Revenue ──────────────────────────────────────────────────
    const categoryRevenue = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ["$product.category", "Uncategorised"] },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // ── City Revenue ──────────────────────────────────────────────────────
    const cityRevenue = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $ifNull: ["$shippingAddress.city", "Unknown"] },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
    ]);

    // ── Payment Methods ───────────────────────────────────────────────────
    const paymentMethods = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $ifNull: ["$paymentMethod", "Unknown"] },
          revenue: { $sum: "$totalAmount" },
          count: { $count: {} },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // ── Customer Stats ────────────────────────────────────────────────────
    // ✅ FIX 4: new customers = users created within the period
    const [newCustomersCount, totalUsers, absoluteTotal] = await Promise.all([
      User.countDocuments({ createdAt: dateFilter.createdAt }),
      User.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, rev: { $sum: "$totalAmount" }, count: { $count: {} } } },
      ]),
    ]);

    const abs = absoluteTotal[0] || { rev: 0, count: 0 };
    const returningCustomers = Math.max(0, curr.orders - newCustomersCount);

    // ✅ FIX 5: sensible conversion rate = (period orders / total users) * 100, capped at 100
    const conversionRate =
      totalUsers > 0
        ? Math.min(100, ((curr.orders / totalUsers) * 100)).toFixed(1)
        : "0.0";

    return NextResponse.json(
      {
        period,
        revenue: curr.revenue,
        orders: curr.orders,
        refunded: curr.refunded,
        prevRevenue: prev.revenue,
        prevOrders: prev.orders,
        totalRevenue: abs.rev,
        totalOrders: abs.count,
        trends,
        topProducts,
        categoryRevenue,
        cityRevenue,
        paymentMethods,
        customerStats: {
          totalUsers,
          newCustomers: newCustomersCount,
          returningCustomers: returningCustomers,
          conversionRate,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("Revenue API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}