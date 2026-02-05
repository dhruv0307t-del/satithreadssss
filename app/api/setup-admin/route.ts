import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { hashPassword, validateEmail, validatePassword } from "@/app/lib/password";

export async function POST(req: Request) {
    try {
        await connectDB();

        // Check if any admin exists
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount >= 6) {
            return NextResponse.json(
                { success: false, message: "Maximum admin limit (6) reached." },
                { status: 403 }
            );
        }

        const { email, password, name } = await req.json();

        if (!validateEmail(email)) {
            return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
        }

        if (!password || password.length < 8) {
            return NextResponse.json({ success: false, message: "Password too short" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Check if they are already admin (redundant due to adminCount check usually, but good for safety)
            if (existingUser.role === 'admin') {
                return NextResponse.json(
                    { success: false, message: "Account already exists and is an admin." },
                    { status: 409 }
                );
            }

            // Upgrade existing user
            existingUser.role = "admin";
            existingUser.password = hashedPassword; // Set/Update password so they can log in via credentials

            // If name is provided and different, maybe update it? Or keep existing. 
            // Let's keep existing name unless it's missing.
            if (!existingUser.name && name) {
                existingUser.name = name;
            }

            await existingUser.save();

            return NextResponse.json({ success: true, message: "Existing account upgraded to Admin!" });
        }

        // Create new admin
        const newAdmin = await User.create({
            email,
            password: hashedPassword,
            name: name || "Admin",
            role: "admin",
            provider: "credentials"
        });

        return NextResponse.json({ success: true, message: "Admin created successfully" });

    } catch (error) {
        console.error("Setup admin error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
