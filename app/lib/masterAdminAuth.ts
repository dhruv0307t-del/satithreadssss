import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function verifyMasterAdmin() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { authorized: false, error: "Unauthorized" };
    }

    if (session.user.role !== "master_admin") {
        return { authorized: false, error: "Access denied. Master admin privileges required." };
    }

    return { authorized: true, user: session.user };
}
