import AdminLog from "@/app/models/AdminLog";
import { connectDB } from "@/app/lib/db";

interface LogActionParams {
    adminId: string;
    adminEmail: string;
    action: "password_changed" | "password_changed_self" | "admin_created" | "admin_deleted" | "admin_demoted" | "admin_promoted" | "master_admin_promoted" | "user_updated";
    targetUserId?: string;
    targetUserEmail?: string;
    details?: string;
    ipAddress?: string;
}

export async function logAdminAction(params: LogActionParams) {
    try {
        await connectDB();

        await AdminLog.create({
            adminId: params.adminId,
            adminEmail: params.adminEmail,
            action: params.action,
            targetUserId: params.targetUserId,
            targetUserEmail: params.targetUserEmail,
            details: params.details,
            ipAddress: params.ipAddress,
        });
    } catch (error) {
        console.error("Failed to log admin action:", error);
        // Don't throw - logging failure shouldn't break the main operation
    }
}
