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
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set("sb:token", authData.session.access_token);


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