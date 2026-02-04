
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import User from "@/app/models/User";
import Product from "@/app/models/Product"; // Ensure Product is registered
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import MyOrdersClient from "./components/MyOrdersClient";

export default async function MyOrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/home");
    }

    await connectDB();

    // Register Product model if not already (Mongoose quirk)
    // Just importing it above should be enough if the file exports the model conditionally

    // Fetch User for Wishlist & Liked first to get ID
    const user = await User.findOne({ email: session.user.email })
        .populate("wishlist")
        .populate("likedProducts")
        .lean();

    if (!user) {
        redirect("/home");
    }

    // Fetch Orders
    const orders = await Order.find({ user: user._id })
        .populate("items.product")
        .sort({ createdAt: -1 })
        .lean();

    const safeOrders = JSON.parse(JSON.stringify(orders));
    const wishlist = user?.wishlist ? JSON.parse(JSON.stringify(user.wishlist)) : [];
    const likedProducts = user?.likedProducts ? JSON.parse(JSON.stringify(user.likedProducts)) : [];

    return (
        <MyOrdersClient
            orders={safeOrders}
            wishlist={wishlist}
            likedProducts={likedProducts}
        />
    );
}
