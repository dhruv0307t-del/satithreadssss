
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Coupon from "@/app/models/Coupon";

export async function POST(req: Request) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code) {
            return NextResponse.json({ success: false, message: "Code required" }, { status: 400 });
        }

        await connectDB();

        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return NextResponse.json({ success: false, message: "Invalid or inactive coupon" }, { status: 404 });
        }

        if (cartTotal < coupon.minCartValue) {
            return NextResponse.json({
                success: false,
                message: `Minimum cart value of Rs. ${coupon.minCartValue} required`
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            discount: coupon.discount,
            type: coupon.type,
            code: coupon.code
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Validation failed" }, { status: 500 });
    }
}
