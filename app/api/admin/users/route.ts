import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

import Order from "@/app/models/Order";

export async function GET() {
  await connectDB();

  // Register Order model to ensure it exists
  // mongoose.models.Order || mongoose.model("Order", Order.schema);

  const users = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "user",
        as: "ordersData",
      },
    },
    {
      $addFields: {
        totalOrders: { $size: "$ordersData" },
        totalSpent: { $sum: "$ordersData.totalAmount" },
      },
    },
    {
      $project: {
        ordersData: 0, // Exclude the full orders array to keep payload light
        password: 0,   // Exclude sensitive data
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return NextResponse.json(users);
}
