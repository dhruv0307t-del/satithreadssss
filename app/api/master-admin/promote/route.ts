import { NextResponse } from "next/server";
import { verifyMasterAdmin } from "@/app/lib/masterAdminAuth";
import { logAdminAction } from "@/app/lib/logAdminAction";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(req: Request) {
    const auth = await verifyMasterAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        await connectDB();

        const { userId, role } = await req.json();

        if (!userId || !role) {
            return NextResponse.json(
                { error: "User ID and role are required" },
                { status: 400 }
            );
        }

        if (!["admin", "master_admin"].includes(role)) {
            return NextResponse.json(
                { error: "Invalid role. Must be 'admin' or 'master_admin'" },
                { status: 400 }
            );
        }

        // If promoting to master_admin, check the limit
        if (role === "master_admin") {
            const masterAdminCount = await User.countDocuments({ role: "master_admin" });

            if (masterAdminCount >= 2) {
                return NextResponse.json(
                    { error: "Maximum of 2 master admins allowed" },
                    { status: 403 }
                );
            }
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update the user's role
        await User.findByIdAndUpdate(userId, { role });

        // Log the action
        await logAdminAction({
            adminId: auth.user.id,
            adminEmail: auth.user.email!,
            action: role === "master_admin" ? "master_admin_promoted" : "admin_promoted",
            targetUserId: userId,
            targetUserEmail: targetUser.email,
            details: `User promoted to ${role}`,
        });

        return NextResponse.json({
            success: true,
            message: `User promoted to ${role} successfully`,
        });
    } catch (error: any) {
        console.error("Promote user error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to promote user" },
            { status: 500 }
        );
    }
}
