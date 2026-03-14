import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
    // ── Auth guard ──────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "admin" && role !== "master_admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // ── Optional date filter ─────────────────────────────────────────────────
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const query: any = {};
    if (from || to) {
        query.createdAt = {};
        if (from) query.createdAt.$gte = new Date(from);
        if (to) query.createdAt.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
    }

    // ── Fetch ────────────────────────────────────────────────────────────────
    const users = await User.find(query)
        .lean()
        .select("name email role isSubscribed createdAt addresses");

    // ── Build CSV ─────────────────────────────────────────────────────────────
    const escape = (v: any) => {
        const s = v == null ? "" : String(v);
        return s.includes(",") || s.includes('"') || s.includes("\n")
            ? `"${s.replace(/"/g, '""')}"`
            : s;
    };

    const headers = [
        "User ID",
        "Name",
        "Email",
        "Role",
        "Subscribed",
        "Saved Addresses Count",
        "Default Address",
        "Joined Date",
    ];

    const rows = users.map((u: any) => {
        const defaultAddr = (u.addresses || []).find((a: any) => a.isDefault);
        const addrStr = defaultAddr
            ? `${defaultAddr.address}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}`
            : "";
        return [
            u._id.toString(),
            u.name || "",
            u.email || "",
            u.role || "user",
            u.isSubscribed ? "Yes" : "No",
            (u.addresses || []).length,
            addrStr,
            new Date(u.createdAt).toLocaleDateString("en-IN"),
        ].map(escape).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\r\n");

    // ── Stream response ───────────────────────────────────────────────────────
    const dateStr = new Date().toISOString().split("T")[0];
    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="users-export-${dateStr}.csv"`,
            "Cache-Control": "no-store",
        },
    });
}
