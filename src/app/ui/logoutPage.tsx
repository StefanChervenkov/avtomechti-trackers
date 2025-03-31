"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      // Call the logout function
      const result = await logout();

      if (!result.success) {
        console.error("Error during logout:", result.message);
        return;
      }

      // Redirect to the login page
      router.push("/login");
    };

    signOut();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium">Signing you out...</p>
    </div>
  );
}