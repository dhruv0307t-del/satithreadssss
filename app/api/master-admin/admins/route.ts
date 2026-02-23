import { NextResponse } from "next/server";
import { verifyMasterAdmin } from "@/app/lib/masterAdminAuth";
import { logAdminAction } from "@/app/lib/logAdminAction";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { hashPassword, validateEmail } from "@/app/lib/password";

export async function GET() {
    const auth = await verifyMasterAdmin();
    if (!auth.authorized) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    try {
        await connectDB();

        // Fetch all users with admin or master_admin roles
        const admins = await User.find({
            role: { $in: ["admin", "master_admin"] }
        })
            .select("name email role createdAt totalOrders totalSpent")
            .sort({ createdAt: -1 })
            .lean();

        // Count total admins and master admins
        const masterAdminCount = admins.filter(a => a.role === "master_admin").length;
        const regularAdminCount = admins.filter(a => a.role === "admin").length;

        return NextResponse.json({
            success: true,
            admins,
            stats: {
                totalAdmins: admins.length,
                masterAdmins: masterAdminCount,
                regularAdmins: regularAdminCount,
            },
        });
    } catch (error: any) {
        console.error("Fetch admins error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch admins" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const auth = await verifyMasterAdmin();
    if (!auth.authorized || !auth.user) {
        return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const masterAdminId = auth.user.id;
    const masterAdminEmail = auth.user.email!;

    try {
        await connectDB();

        const { name, email, password } = await req.json();

        // Validate inputs
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }
        if (!validateEmail(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // Check total admin count
        const adminCount = await User.countDocuments({ role: { $in: ["admin", "master_admin"] } });
        if (adminCount >= 10) {
            return NextResponse.json({ error: "Maximum admin limit reached." }, { status: 403 });
        }

        const hashedPassword = await hashPassword(password);
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.role === "admin" || existingUser.role === "master_admin") {
                return NextResponse.json(
                    { error: "This email is already an admin account." },
                    { status: 409 }
                );
            }
            // Upgrade existing user
            existingUser.role = "admin";
            existingUser.password = hashedPassword;
            if (!existingUser.name && name) existingUser.name = name;
            await existingUser.save();

            await logAdminAction({
                adminId: masterAdminId,
                adminEmail: masterAdminEmail,
                action: "admin_created",
                targetUserId: existingUser._id.toString(),
                targetUserEmail: email,
                details: `Existing user upgraded to admin by master admin`,
            });

            return NextResponse.json({ success: true, message: "User upgraded to admin!" });
        }

        // Create brand-new admin
        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            provider: "credentials",
        });

        await logAdminAction({
            adminId: masterAdminId,
            adminEmail: masterAdminEmail,
            action: "admin_created",
            targetUserId: newAdmin._id.toString(),
            targetUserEmail: email,
            details: `New admin account created by master admin`,
        });

        return NextResponse.json({ success: true, message: "Admin created successfully!" });
    } catch (error: any) {
        console.error("Create admin error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create admin" },
            { status: 500 }
        );
    }
}
