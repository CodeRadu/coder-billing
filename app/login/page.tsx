"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const login = async (formData: FormData) => {
    const { email, password } = Object.fromEntries(formData);
    const status = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!status || !status.ok) return setError("Failed to log in");
    return redirect("/");
  };
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={login}
        >
          {error != null && (
            <span className="text-red-500">{error.toString()}</span>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
