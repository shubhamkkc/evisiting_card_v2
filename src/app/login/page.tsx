"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  // Pre-filled when signup redirects an already-registered user here.
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const alreadyRegistered = searchParams.get("already") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Only stop loading on error — on success keep the button
        // disabled + spinning until the redirect lands.
        setLoading(false);
        setError(
          error.message === "Invalid login credentials"
            ? "Invalid email or password"
            : error.message === "Email not confirmed"
              ? "Please verify your email first — check your inbox for the code."
              : error.message
        );
        return;
      }
    } catch {
      setLoading(false);
      setError("Sign-in failed. Please check your connection and try again.");
      return;
    }

    try {
      const res = await fetch("/api/auth/session", {
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => ({}));
      if (data.role === "admin") router.push("/admin/dashboard");
      else if (data.role === "owner") router.push("/owner/dashboard");
      else router.push("/owner/create");
    } catch {
      router.push("/owner/create");
    }
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

        {alreadyRegistered && (
          <div className="p-3 bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-lg mb-6 text-center">
            Your account already exists. Please log in with your password.
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-right -mt-3">
            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">Sign up free →</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
