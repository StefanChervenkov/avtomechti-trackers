"use server";

import { supabase } from "@/app/lib/supabase";
import { LoginFormSchema } from "@/app/lib/definitions";
import { z } from "zod";
import { cookies } from "next/headers";

export async function login(data: { email: string; password: string }) {
  try {
    // Validate the input using Zod schema
    const validatedData = LoginFormSchema.parse(data);

    // Authenticate the user with Supabase
    const { data: session, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Set the authToken cookie (Supabase session token)
    cookies().set({
      name: "authToken",
      value: session.session?.access_token || "", // Use the access token from Supabase
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors
      return { success: false, errors: error.errors.map((err) => err.message) };
    }

    // Handle unexpected errors
    return { success: false, message: "Something went wrong. Please try again." };
  }
}