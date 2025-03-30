import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function authenticateUser(request: NextRequest) {
  const accessToken = request.cookies.get("sb:token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate session using Supabase
  const { data: { user }, error } = await supabase.auth.getUser(accessToken || "");

  if (error || !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // User is authenticated, allow request to proceed
  const response = NextResponse.next();

  // Set the current pathname in a cookie
  const pathname = request.nextUrl.pathname;
  response.cookies.set("current-pathname", pathname);

  return response;
}