import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect Admin Routes
  if (path.startsWith("/admin")) {
    // Allow access to login page
    if (path === "/admin/login") {
      return NextResponse.next();
    }

    // Verify session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const url = new URL("/admin/login", req.url);
      return NextResponse.redirect(url);
    }

    // Verify Admin Role
    if (token.role !== "admin") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
