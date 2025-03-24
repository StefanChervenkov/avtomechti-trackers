// filepath: c:\WebDev\avtomechti-trackers\src\middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "./app/lib/supabase";

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("sb:token")?.value;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    //Validate session using Supabase

    const { data: { user }, error } = await supabase.auth.getUser(accessToken || "");

    if (error || !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    //User is authenticated allow request to proceed
    return NextResponse.next();

}

export const config = {
    matcher: ["/((?!_next|api|login).*)"], // Apply middleware to all routes except /_next, /api, and /login
};