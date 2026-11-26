"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Invalid email or password."
          : error.message === "Email not confirmed"
            ? "Please verify your email first — check your inbox for the code."
            : error.message
      );
      return;
    }

    const res = await fetch("/api/auth/session");
    const data = await res.json().catch(() => ({}));
    if (data.role === "admin") router.push("/admin/dashboard");
    else if (data.role === "owner") router.push("/owner/dashboard");
    else router.push("/owner/create");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 border-t-4 border-blue-600">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to manage your digital cards</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
