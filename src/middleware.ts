// filepath: c:\WebDev\avtomechti-trackers\src\middleware.ts
import { authenticateUser } from "@/app/lib/middleware/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Exclude the /login route from authentication checks
  if (request.nextUrl.pathname === "/login") {
    const response = NextResponse.next();
    response.cookies.set("current-pathname", request.nextUrl.pathname);
    return response;
  }

  // Delegate authentication to authenticateUser
  const response = await authenticateUser(request);

  // Set the current pathname in a cookie
  response.cookies.set("current-pathname", request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)", // Apply middleware to all routes except static files, API, and /login
};