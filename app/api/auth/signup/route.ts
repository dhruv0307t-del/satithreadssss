import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { hashPassword, validateEmail, validatePassword } from "@/app/lib/password";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password, name } = await req.json();

        // Validate email
        if (!validateEmail(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password does not meet requirements",
                    errors: passwordValidation.errors,
                },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name: name || email.split("@")[0], // Use email prefix as default name
            provider: "credentials",
        });

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create account" },
            { status: 500 }
        );
    }
}
