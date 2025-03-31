// filepath: c:\WebDev\avtomechti-trackers\src\middleware.ts
import { authenticateUser } from "@/app/lib/middleware/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the user is authenticated
  const accessToken = request.cookies.get("sb:token")?.value;

  if (pathname === "/login") {
    // If the user is authenticated, redirect them away from /login
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to /devices or another page
    }

    // Allow unauthenticated users to access /login
    const response = NextResponse.next();
    response.cookies.set("current-pathname", pathname);
    return response;
  }

  // Delegate authentication to authenticateUser for other routes
  const response = await authenticateUser(request);

  // Set the current pathname in a cookie
  response.cookies.set("current-pathname", pathname);

  return response;
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)", // Apply middleware to all routes except static files, API, and /login
};