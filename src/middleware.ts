// filepath: c:\WebDev\avtomechti-trackers\src\middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("authToken"); // Check for an auth token in cookies

  // If the user is not authenticated and is not on the login page, redirect to /login
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|login).*)"], // Apply middleware to all routes except /_next, /api, and /login
};