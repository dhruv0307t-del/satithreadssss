import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Auth is now handled in the page component with modal
  // No need to redirect to /login page
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*"],
};
