import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

// GET: Fetch all saved addresses for the current user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email }).select("addresses");

        return NextResponse.json({
            success: true,
            addresses: user?.addresses || []
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Add a new address or update existing default
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, address, city, state, pincode, isDefault } = body;

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // If this is set as default, unset others
        if (isDefault) {
            user.addresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        // Add new address
        user.addresses.push({
            name,
            phone,
            address,
            city,
            state,
            pincode,
            isDefault: isDefault || (user.addresses.length === 0)
        });

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Address saved successfully",
            addresses: user.addresses
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH: Update an existing address or set as default
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, phone, address, city, state, pincode, isDefault, landmark } = body;

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const addrIndex = user.addresses.findIndex((a: any) => a._id.toString() === id);
        if (addrIndex === -1) {
            return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
        }

        // If setting as default, unset others
        if (isDefault) {
            user.addresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        // Update fields
        const addr = user.addresses[addrIndex];
        if (name) addr.name = name;
        if (phone) addr.phone = phone;
        if (address) addr.address = address;
        if (city) addr.city = city;
        if (state) addr.state = state;
        if (pincode) addr.pincode = pincode;
        if (landmark !== undefined) addr.landmark = landmark;
        if (isDefault !== undefined) addr.isDefault = isDefault;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Address updated successfully",
            addresses: user.addresses
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE: Remove a saved address
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        let addressId = searchParams.get("id");

        if (!addressId) {
            const body = await req.json().catch(() => ({}));
            addressId = body.id;
        }

        if (!addressId) {
            return NextResponse.json({ success: false, message: "Address ID required" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.addresses
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
