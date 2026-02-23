import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function verifyMasterAdmin() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { authorized: false as const, error: "Unauthorized", user: null };
    }

    if (session.user.role !== "master_admin") {
        return { authorized: false as const, error: "Access denied. Master admin privileges required.", user: null };
    }

    return { authorized: true as const, user: session.user };
}
