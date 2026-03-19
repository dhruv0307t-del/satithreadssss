import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { calculateShippingFee } from "@/app/lib/shipping";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const body = await req.json();
    const { items, shippingAddress, paymentMethod, couponCode, discountAmount, isExpress } = body;

    const formattedItems = items.map((item: any) => ({
      product: item.id,
      name: item.title,
      image: item.image,
      price: item.price,
      quantity: item.qty,
      size: item.size || "M",
      color: item.color || "",
    }));

    const subtotal = formattedItems.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    );

    // Server-side simple validation
    const finalDiscount = discountAmount || 0;

    // Recalculate shipping for verification
    const verifiedShippingFee = calculateShippingFee(
      subtotal,
      shippingAddress.city,
      shippingAddress.state,
      !!isExpress
    );

    const totalAmount = subtotal - finalDiscount + verifiedShippingFee;

    let razorpayOrder = null;
    if (paymentMethod === "ONLINE" || paymentMethod === "UPI") {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Razorpay accepts amount in paise
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        });
      } catch (err) {
        console.error("Razorpay Order Error:", err);
        return NextResponse.json({ success: false, message: "Failed to create payment order" }, { status: 500 });
      }
    }

    const order = await Order.create({
      user: userId,
      items: formattedItems,
      subtotal,
      shippingFee: verifiedShippingFee,
      isExpress: !!isExpress,
      discount: finalDiscount,
      couponCode: couponCode || "",
      totalAmount: totalAmount > 0 ? totalAmount : 0,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "pending",
      shippingAddress,
      razorpayOrderId: razorpayOrder?.id,
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder?.id,
      totalAmount: totalAmount,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Order Creation Logic Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
