
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Coupon from "@/app/models/Coupon";

export async function GET() {
    await connectDB();
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return NextResponse.json(coupons);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await connectDB();
    try {
        const body = await req.json();
        const coupon = await Coupon.create(body);
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
    }
}
