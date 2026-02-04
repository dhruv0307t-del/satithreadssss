import { connectDB } from "@/app/lib/db";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const bestSellers = await Product.find({
    isBestSeller: true,
  }).limit(8);

  return NextResponse.json(bestSellers);
}
