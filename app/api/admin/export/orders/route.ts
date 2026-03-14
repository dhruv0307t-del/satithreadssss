import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";

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

    // ── Fetch with populated user ────────────────────────────────────────────
    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .populate("user", "name email")
        .lean();

    // ── Build CSV ─────────────────────────────────────────────────────────────
    const escape = (v: any) => {
        const s = v == null ? "" : String(v);
        return s.includes(",") || s.includes('"') || s.includes("\n")
            ? `"${s.replace(/"/g, '""')}"`
            : s;
    };

    const headers = [
        "Order ID",
        "Customer Name",
        "Customer Email",
        "Order Status",
        "Payment Status",
        "Items Count",
        "Items Summary",
        "Total Amount (₹)",
        "Shipping - Name",
        "Shipping - Phone",
        "Shipping - Address",
        "Shipping - City",
        "Shipping - State",
        "Shipping - Pincode",
        "Coupon Code",
        "Discount Amount (₹)",
        "Shipping Fee (₹)",
        "Order Date",
    ];

    const rows = orders.map((o: any) => {
        const itemsSummary = (o.items || [])
            .map((it: any) => `${it.name || "Item"} x${it.quantity || 1}`)
            .join("; ");

        const addr = o.shippingAddress || {};

        return [
            o._id.toString(),
            o.user?.name || o.shippingAddress?.name || "Guest",
            o.user?.email || "",
            o.orderStatus || "placed",
            o.paymentStatus || "pending",
            (o.items || []).length,
            itemsSummary,
            (o.totalAmount || 0).toFixed(2),
            addr.name || "",
            addr.phone || "",
            addr.address || addr.street || "",
            addr.city || "",
            addr.state || "",
            addr.pincode || addr.postalCode || "",
            o.couponCode || "",
            (o.discountAmount || 0).toFixed(2),
            (o.shippingFee || 0).toFixed(2),
            new Date(o.createdAt).toLocaleDateString("en-IN"),
        ].map(escape).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\r\n");

    // ── Stream response ───────────────────────────────────────────────────────
    const dateStr = new Date().toISOString().split("T")[0];
    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="orders-export-${dateStr}.csv"`,
            "Cache-Control": "no-store",
        },
    });
}
