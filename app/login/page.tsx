"use client";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  return (
    <main className="p-8">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <button className="bg-blue-600 text-white px-4 py-2" onClick={() => signIn("google")}>
        Sign in with Google
      </button>
    </main>
  );
} 