import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import Order from "@/app/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await User.findOne({ email: session.user.email }).lean();
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Dynamic stats from DB
        const orders = await Order.find({ user: user._id }).lean();
        const totalSpent = orders.reduce((sum, order: any) => sum + (order.totalAmount || 0), 0);
        const orderCount = orders.length;
        const addressCount = user.addresses?.length || 0;

        return NextResponse.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                gender: user.gender,
                role: user.role,
                createdAt: user.createdAt,
                id: user._id
            },
            stats: {
                orders: orderCount,
                spent: totalSpent,
                addresses: addressCount
            }
        });
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, phone, dob, gender } = body;

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { name, phone, dob, gender } },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                dob: updatedUser.dob,
                gender: updatedUser.gender
            }
        });
    } catch (error) {
        console.error("Profile PATCH Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
