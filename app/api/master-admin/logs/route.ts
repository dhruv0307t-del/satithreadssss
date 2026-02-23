import { NextResponse } from "next/server";
import { verifyMasterAdmin } from "@/app/lib/masterAdminAuth";
import { connectDB } from "@/app/lib/db";
import AdminLog from "@/app/models/AdminLog";

export async function GET(req: Request) {
    const auth = await verifyMasterAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const action = searchParams.get("action");
        const adminId = searchParams.get("adminId");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Build query filter
        const query: any = {};

        if (action) {
            query.action = action;
        }

        if (adminId) {
            query.adminId = adminId;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            AdminLog.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AdminLog.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error("Fetch logs error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch logs" },
            { status: 500 }
        );
    }
}
