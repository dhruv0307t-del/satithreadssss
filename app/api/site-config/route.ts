
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import SiteConfig from "@/app/models/SiteConfig";

export async function GET() {
    await connectDB();
    try {
        const config = await SiteConfig.findOne();
        return NextResponse.json(config || {});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await connectDB();
    try {
        const body = await req.json();
        let config = await SiteConfig.findOne();
        if (config) {
            config.set(body);
            await config.save();
        } else {
            config = await SiteConfig.create(body);
        }
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
    }
}
