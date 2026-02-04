
import Product from "@/app/models/Product";
import { connectDB } from "@/app/lib/db";
import CategoryClient from "./CategoryClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectDB();

  const productsRaw = await Product.find({
    categorySlug: slug,
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .lean();
    const safeProducts = JSON.parse(JSON.stringify(productsRaw));
  /* 🔥 SLUG → TOP IMAGE MAP */
  const CATEGORY_HEADERS: Record<string, string> = {
    "kurta-sets": "/category-headers/Kurta-Sets.png",
    "dupatta-sets": "/category-headers/Duppata.png",
    "skirts": "/category-headers/skirts.png",
    "cord-sets": "/category-headers/coord.png",
    "farshi-salwar-sets": "/category-headers/Farshi.png",
    "tops": "/category-headers/tops.png",
    "short-kurtis": "/category-headers/short-kurtis.png",
  };

  const topImage =
  CATEGORY_HEADERS[slug] || "/category-headers/default.jpg";

  return (
    <CategoryClient
      products={safeProducts}
      topImage={topImage}
    />
);
}
