import { NextResponse } from "next/server";
import ContactMessage from "@/app/models/ContactMessage";
import { connectDB } from "@/app/lib/db";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { name, email, phone, subject, message } = await req.json();

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Please fill in all required fields" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        // Create new contact message
        const contactMessage = await ContactMessage.create({
            name,
            email,
            phone: phone || "",
            subject,
            message,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Thank you for contacting us! We'll get back to you soon.",
                data: contactMessage,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to submit contact form" },
            { status: 500 }
        );
    }
}
