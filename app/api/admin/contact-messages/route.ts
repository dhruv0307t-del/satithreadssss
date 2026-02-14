import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import ContactMessage from "@/app/models/ContactMessage";
import { connectDB } from "@/app/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is authenticated and is admin
        if (!session || !session.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Fetch all contact messages, sorted by newest first
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, messages }, { status: 200 });
    } catch (error: any) {
        console.error("Fetch contact messages error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch contact messages" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is authenticated and is admin
        if (!session || !session.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json(
                { error: "Message ID and status are required" },
                { status: 400 }
            );
        }

        const message = await ContactMessage.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!message) {
            return NextResponse.json(
                { error: "Message not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Status updated successfully", data: message },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update message status error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update message status" },
            { status: 500 }
        );
    }
}
