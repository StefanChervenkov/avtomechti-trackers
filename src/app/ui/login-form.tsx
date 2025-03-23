"use client";

import { useState } from "react";
import { login } from "@/app/actions.ts/auth";

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    setPending(true);
    setErrors([]);

    // Call the server action
    const result = await login(data);

    setPending(false);

    if (result.success) {
      // Redirect or handle successful login
      window.location.href = "/";
    } else if (result.errors) {
      // Display validation errors
      setErrors(result.errors);
    } else {
      // Display general error message
      setErrors([result.message]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {/* Error Box */}
        {errors.length > 0 && (
          <div className="mb-4 p-3 border border-red-500 bg-red-100 text-red-700 rounded">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded ${
            pending
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={pending}
        >
          {pending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}