import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const search = searchParams.get("search") || "";
    const isBestSeller = searchParams.get("isBestSeller") === "true";
    const isFestive = searchParams.get("isFestive") === "true";
    const categoryQuery = searchParams.get("category");
    const sort = searchParams.get("sort") || "";

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (isBestSeller) {
      query.isBestSeller = true;
    }

    if (isFestive) {
      query.isFestive = true;
    }

    if (categoryQuery && categoryQuery !== "festive") {
      query.categorySlug = categoryQuery;
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === "price") sortOptions = { priceNew: 1 };
    if (sort === "stock") sortOptions = { quantity: -1 };

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("PRODUCTS GET ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      description,
      fabric,
      category,
      subCategory,
      categoryTheme,
      sizes,
      colors,
      quantity,
      priceOld,
      priceNew,
      discountPercent,
      couponAllowed,
      mainImage,
      gridImages,
      video,
      isFeatured,
      isActive,
    } = body;

    if (!name || !priceNew || !category || !mainImage) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      description,
      fabric,
      category,
      categorySlug: slugify(category), // 🔥 THIS IS KEY
      subCategory,
      categoryTheme,
      sizes,
      colors,
      quantity,
      priceOld,
      priceNew,
      discountPercent,
      couponAllowed,
      mainImage,
      gridImages,
      video,
      isFeatured,
      isActive,
    });

    return NextResponse.json(
      { message: "Product created", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
