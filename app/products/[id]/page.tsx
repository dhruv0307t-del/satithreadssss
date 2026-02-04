import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";
import { disconnect } from "mongoose";

async function getProduct(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product) return null;

    // Serializing MongoDB IDs to strings to pass to Client Components
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRecommendations(categorySlug: string, currentProductId: string) {
  try {
    await connectDB();
    // Simple logic: fetch other products. Enhance filtering by category if slug is available.
    const products = await Product.find({ _id: { $ne: currentProductId } }).limit(6).lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || product.message) {
    notFound();
  }

  const recommendations = await getRecommendations(product.categorySlug, product._id);

  return (
    <div className="product-detail-page">
      <ProductClient product={product} recommendations={recommendations} />
    </div>
  );
}
