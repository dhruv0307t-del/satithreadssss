import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        const body = await req.json();
        const {
            orderId, // local order ID
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = body;

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const expectedSignature = hmac.digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
        }

        // Update order in DB
        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentStatus: "paid",
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Payment verified and order updated" });
    } catch (err) {
        console.error("Verification Error:", err);
        return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 500 });
    }
}
