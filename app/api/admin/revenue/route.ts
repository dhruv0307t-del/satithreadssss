import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import User from "@/app/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin" && (session.user as any).role !== "master_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get("startDate");
    const endParam = searchParams.get("endDate");
    const period = searchParams.get("period") || "month";

    const now = new Date();
    // Use UTC boundaries to avoid local server timezone confusion if necessary, 
    // but for now let's be extremely explicit about the range.
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
    const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);

    // Filter Logic
    let dateFilter: any = {};
    let comparisonFilter: any = {};

    switch (period) {
      case "today":
        dateFilter = { createdAt: { $gte: startOfToday, $lte: endOfToday } };
        const yesterdayStart = new Date(startOfToday);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = new Date(endOfToday);
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        comparisonFilter = { createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } };
        break;
      case "week":
        dateFilter = { createdAt: { $gte: startOfWeek, $lte: endOfToday } };
        const prevWeekStart = new Date(startOfWeek);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        const prevWeekEnd = new Date(startOfWeek);
        prevWeekEnd.setMilliseconds(-1);
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

    // Basic aggregation for current period
    const currentMetrics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
          orders: { $count: {} },
          refunded: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, "$totalAmount", 0] }
          }
        }
      }
    ]);

    // Basic aggregation for comparison period
    const comparisonMetrics = await Order.aggregate([
      { $match: comparisonFilter },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
          orders: { $count: {} }
        }
      }
    ]);

    const curr = currentMetrics[0] || { revenue: 0, orders: 0, refunded: 0 };
    const prev = comparisonMetrics[0] || { revenue: 0, orders: 0 };

    // Trends based on period
    let trendGroup: any = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" }
    };
    if (period === "today") trendGroup = { hour: { $hour: "$createdAt" } };
    if (period === "week") trendGroup = {
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" }
    };

    const trends = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: trendGroup,
          revenue: { $sum: "$totalAmount" }
        }
      },
      // Sort by whatever keys are present in the group _id
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
    ]);

    // Flatten trends for easier consumption
    const flattenedTrends = trends.map(t => ({
      label: period === "today" ? (t._id.hour !== undefined ? t._id.hour : t._id) :
        period === "week" ? `Day ${t._id.day}` :
          period === "month" || period === "year" ? (t._id.month !== undefined ? t._id.month : t._id) :
            "Data",
      revenue: t.revenue,
      _id: t._id
    }));

    // ... (rest of aggregations)
    // Category, City, Payment (unchanged match logic)

    // Top 5 Products
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // Category
    const categoryRevenue = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      }
    ]);

    // City
    const cityRevenue = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$shippingAddress.city",
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 8 }
    ]);

    // Payment
    const paymentMethods = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$paymentMethod",
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Global stats (for specific cards like Total Revenue that should maybe stay global? 
    // Actually user said "when I click today I should get today's data", so let's make it scoped)

    // We also need some absolute totals for context
    const absoluteTotal = await Order.aggregate([{ $group: { _id: null, rev: { $sum: "$totalAmount" }, count: { $count: {} } } }]);
    const abs = absoluteTotal[0] || { rev: 0, count: 0 };

    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      period,
      debug: {
        now: now.toISOString(),
        start: startOfToday.toISOString(),
        end: endOfToday.toISOString(),
        serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      revenue: curr.revenue,
      orders: curr.orders,
      refunded: curr.refunded,
      prevRevenue: prev.revenue,
      prevOrders: prev.orders,
      totalRevenue: abs.rev,
      totalOrders: abs.count,
      trends: flattenedTrends,
      topProducts,
      categoryRevenue,
      cityRevenue,
      paymentMethods,
      customerStats: {
        totalUsers,
        conversionRate: totalUsers > 0 ? ((curr.orders / totalUsers) * 10).toFixed(1) : 0
      },
      // Keep old fields for backward compatibility
      revenueToday: period === "today" ? curr.revenue : 0,
      revenueMonth: period === "month" ? curr.revenue : 0,
      revenueLastMonth: prev.revenue,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    console.error("Revenue API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
