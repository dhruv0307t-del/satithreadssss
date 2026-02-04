"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Not authenticated" };

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
        user.wishlist.push(productId);
    } else {
        user.wishlist.splice(index, 1);
    }

    await user.save();
    revalidatePath("/my-orders");
    return { success: true, added: index === -1 };
}

export async function toggleLiked(productId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { success: false, message: "Not authenticated" };

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const index = user.likedProducts.indexOf(productId);
    if (index === -1) {
        user.likedProducts.push(productId);
    } else {
        user.likedProducts.splice(index, 1);
    }

    await user.save();
    revalidatePath("/my-orders");
    return { success: true, added: index === -1 };
}
