import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    // ✅ MUST unwrap params
    const { slug } = await context.params;

    const products = await Product.find({
      categorySlug: slug,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { message: "Failed to load category products" },
      { status: 500 }
    );
  }
}
