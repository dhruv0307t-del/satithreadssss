import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";

export async function GET() {
  await connectDB();

  const orders = await Order.find({ paymentStatus: "paid" });

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  return NextResponse.json({
    totalRevenue,
    totalOrders: orders.length,
    avgOrderValue:
      orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
  });
}
