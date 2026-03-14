import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import { Category } from "@/app/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find().sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, categories });
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["admin", "master_admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, slug, thumbnail, headerImage, order } = body;

        if (!title || !slug) {
            return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
        }

        await connectDB();

        // Check if slug exists
        const existing = await Category.findOne({ slug });
        if (existing) {
            return NextResponse.json({ success: false, error: "A category with this slug already exists" }, { status: 400 });
        }

        const category = await Category.create({
            title,
            slug,
            thumbnail,
            headerImage,
            order: order || 0
        });

        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error("POST /api/categories error:", error);
        return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
    }
}
