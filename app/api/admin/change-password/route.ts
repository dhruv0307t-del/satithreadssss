import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import { logAdminAction } from "@/app/lib/logAdminAction";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { hashPassword } from "@/app/lib/password";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["admin", "master_admin"].includes(session.user.role)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    try {
        await connectDB();

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Both current and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: "New password must be at least 8 characters" },
                { status: 400 }
            );
        }

        if (currentPassword === newPassword) {
            return NextResponse.json(
                { error: "New password must be different from current password" },
                { status: 400 }
            );
        }

        // Need to fetch password field (it's select: false in schema)
        const user = await User.findById(session.user.id).select("+password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify current password
        if (!user.password) {
            return NextResponse.json(
                { error: "No password set. This account uses social login." },
                { status: 400 }
            );
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 401 }
            );
        }

        // Hash and save new password
        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;
        await user.save();

        // Log the action
        await logAdminAction({
            adminId: session.user.id,
            adminEmail: session.user.email!,
            action: "password_changed_self",
            targetUserId: session.user.id,
            targetUserEmail: session.user.email!,
            details: "Admin changed their own password",
        });

        return NextResponse.json({ success: true, message: "Password changed successfully!" });
    } catch (error: any) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to change password" },
            { status: 500 }
        );
    }
}
