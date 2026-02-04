import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";
import User from "@/app/models/User";
import Order from "@/app/models/Order";

export async function GET() {
  try {
    await connectDB();

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueAgg,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),

      // total revenue (safe even if no orders)
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      Product.countDocuments({ quantity: { $lte: 5 } }),
    ]);

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      lowStockProducts,
    });
  } catch (error: any) {
    console.error("❌ DASHBOARD ERROR:", error.message);

    return NextResponse.json(
      {
        message: "Dashboard fetch failed",
        error: error.message, // 👈 THIS helps debugging
      },
      { status: 500 }
    );
  }
}
