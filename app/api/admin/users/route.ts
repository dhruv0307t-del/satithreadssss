import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

import Order from "@/app/models/Order";

export async function GET() {
  await connectDB();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 1. Global Stats
  const totalUsers = await User.countDocuments();
  const subscribedCount = await User.countDocuments({ isSubscribed: true });
  const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  // 2. Aggregation for detailed user list
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
        lastOrder: { $arrayElemAt: [{ $sortArray: { input: "$ordersData", sortBy: { createdAt: -1 } } }, 0] },
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        role: 1,
        isSubscribed: 1,
        createdAt: 1,
        totalOrders: 1,
        totalSpent: 1,
        addresses: 1,
        location: { $ifNull: ["$lastOrder.shippingAddress.city", "—"] },
        phone: { $ifNull: ["$lastOrder.shippingAddress.phone", "—"] },
        // Keep order history light in the main list, but maybe include simple IDs/amounts
        orderHistory: {
          $slice: [
            {
              $map: {
                input: { $sortArray: { input: "$ordersData", sortBy: { createdAt: -1 } } },
                as: "o",
                in: {
                  id: "$$o._id",
                  date: "$$o.createdAt",
                  amount: "$$o.totalAmount",
                  status: "$$o.orderStatus"
                }
              }
            },
            5
          ]
        }
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  // 3. Derived Stats
  const activeBuyers = users.filter(u => u.totalOrders > 0).length;
  const totalSpentAll = users.reduce((acc, u) => acc + (u.totalSpent || 0), 0);
  const avgSpend = activeBuyers > 0 ? Math.round(totalSpentAll / activeBuyers) : 0;

  return NextResponse.json({
    users,
    stats: {
      totalUsers,
      activeBuyers,
      subscribedCount,
      avgSpend,
      newUsersThisWeek
    }
  });
}
