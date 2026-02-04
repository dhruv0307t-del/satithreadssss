import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email required" },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email });

        return NextResponse.json({
            success: true,
            exists: !!user,
        });
    } catch (error) {
        console.error("Check email error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to check email" },
            { status: 500 }
        );
    }
}
