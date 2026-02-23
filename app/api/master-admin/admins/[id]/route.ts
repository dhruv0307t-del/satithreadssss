import { NextResponse } from "next/server";
import { verifyMasterAdmin } from "@/app/lib/masterAdminAuth";
import { logAdminAction } from "@/app/lib/logAdminAction";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await verifyMasterAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { action, password, newRole } = body;

        // Prevent master admin from modifying themselves
        if (id === auth.user.id) {
            return NextResponse.json(
                { error: "You cannot modify your own account" },
                { status: 403 }
            );
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Prevent modifying other master admins
        if (targetUser.role === "master_admin") {
            return NextResponse.json(
                { error: "Cannot modify other master admin accounts" },
                { status: 403 }
            );
        }

        let logAction: any;
        let updateData: any = {};

        if (action === "change_password") {
            if (!password || password.length < 6) {
                return NextResponse.json(
                    { error: "Password must be at least 6 characters" },
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
            logAction = "password_changed";
        } else if (action === "change_role") {
            if (!newRole || !["user", "admin"].includes(newRole)) {
                return NextResponse.json(
                    { error: "Invalid role. Must be 'user' or 'admin'" },
                    { status: 400 }
                );
            }

            updateData.role = newRole;
            logAction = newRole === "admin" ? "admin_promoted" : "admin_demoted";
        } else {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }

        await User.findByIdAndUpdate(id, updateData);

        // Log the action
        await logAdminAction({
            adminId: auth.user.id,
            adminEmail: auth.user.email!,
            action: logAction,
            targetUserId: id,
            targetUserEmail: targetUser.email,
            details: action === "change_password"
                ? "Password changed by master admin"
                : `Role changed to ${newRole}`,
        });

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
        });
    } catch (error: any) {
        console.error("Update admin error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await verifyMasterAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;

        // Prevent master admin from deleting themselves
        if (id === auth.user.id) {
            return NextResponse.json(
                { error: "You cannot delete your own account" },
                { status: 403 }
            );
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Prevent deleting other master admins
        if (targetUser.role === "master_admin") {
            return NextResponse.json(
                { error: "Cannot delete other master admin accounts" },
                { status: 403 }
            );
        }

        await User.findByIdAndDelete(id);

        // Log the action
        await logAdminAction({
            adminId: auth.user.id,
            adminEmail: auth.user.email!,
            action: "admin_deleted",
            targetUserId: id,
            targetUserEmail: targetUser.email,
            details: `${targetUser.role} account deleted`,
        });

        return NextResponse.json({
            success: true,
            message: "Admin deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete admin error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete admin" },
            { status: 500 }
        );
    }
}
