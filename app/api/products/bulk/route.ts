import { NextResponse } from "next/server";
import Product from "@/app/models/Product";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        await connectDB();

        const data = await req.json();
        const products = data.products;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json(
                { message: "No products provided" },
                { status: 400 }
            );
        }

        // Process each product to ensure it matches the schema
        const productsToInsert = products.map((p) => {
            // Calculate total quantity from sizes string if needed or use provided quantity
            // Expected Sizes format: "S:10;M:15"
            let sizes = [];
            let totalQty = 0;

            if (typeof p.Sizes === "string") {
                sizes = p.Sizes.split(";").map((s: string) => {
                    const [size, stock] = s.split(":").map((item) => item.trim());
                    const stockNum = parseInt(stock) || 0;
                    totalQty += stockNum;
                    return { size, stock: stockNum };
                });
            }

            // Handle images
            const gridImages = p.GridImages
                ? p.GridImages.split(",").map((url: string) => url.trim())
                : [];

            // Handle colors
            const colors = p.Colors
                ? p.Colors.split(",").map((c: string) => c.trim())
                : [];

            return {
                name: p.Name,
                category: p.Category,
                subCategory: p.SubCategory,
                priceNew: parseFloat(p.Price),
                priceOld: p.OldPrice ? parseFloat(p.OldPrice) : undefined,
                description: p.Description,
                fabric: p.Fabric,
                mainImage: p.MainImage,
                gridImages: gridImages,
                sizes: sizes,
                quantity: totalQty,
                colors: colors,
                isFestive:
                    String(p.IsFestive).toLowerCase() === "yes" || p.IsFestive === true,
                isBestSeller:
                    String(p.IsBestSeller).toLowerCase() === "yes" ||
                    p.IsBestSeller === true,
                categorySlug: p.Category?.toLowerCase().replace(/\s+/g, "-") || "new",
                isActive: true,
            };
        });

        const inserted = await Product.insertMany(productsToInsert);

        return NextResponse.json(
            { message: "Bulk upload successful", count: inserted.length },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            { message: error.message || "Failed to upload products" },
            { status: 500 }
        );
    }
}
