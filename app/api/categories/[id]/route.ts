import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Category } from "@/app/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["admin", "master_admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        await connectDB();

        const category = await Category.findByIdAndUpdate(params.id, body, { new: true });
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error("PATCH /api/categories/[id] error:", error);
        return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["admin", "master_admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const category = await Category.findByIdAndDelete(params.id);
        if (!category) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/categories/[id] error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
    }
}
