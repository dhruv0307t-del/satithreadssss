import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const body = await req.json();
  const { items, shippingAddress, paymentMethod, couponCode, discountAmount } = body;

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

  // Server-side simple validation (could actally check DB again for strictness)
  const finalDiscount = discountAmount || 0;
  const totalAmount = subtotal - finalDiscount;

  const order = await Order.create({
    user: userId,
    items: formattedItems,
    subtotal,
    shippingFee: 0,
    discount: finalDiscount,
    couponCode: couponCode || "",
    totalAmount: totalAmount > 0 ? totalAmount : 0,
    paymentMethod: paymentMethod || "TEST",
    paymentStatus: "pending",
    shippingAddress,
  });

  return NextResponse.json({
    success: true,
    orderId: order._id,
  });
}
