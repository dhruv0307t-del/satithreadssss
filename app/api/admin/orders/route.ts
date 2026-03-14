import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "items.product",
        select: "name mainImage",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "admin" && role !== "master_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { orderId, orderStatus, paymentStatus, trackingNumber, trackingNote } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const validOrderStatuses = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];

    const update: any = {};
    if (orderStatus && validOrderStatuses.includes(orderStatus)) update.orderStatus = orderStatus;
    if (paymentStatus && validPaymentStatuses.includes(paymentStatus)) update.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;
    if (trackingNote !== undefined) update.trackingNote = trackingNote;
    update.updatedAt = new Date();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: update },
      { new: true }
    ).populate("user", "name email");

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
