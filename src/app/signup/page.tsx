"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Building2, Mail, Lock, ShieldCheck } from "lucide-react";

type Step = "form" | "otp";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function redirectByRole() {
    const res = await fetch("/api/auth/session");
    const data = await res.json().catch(() => ({}));
    if (data.role === "admin") router.push("/admin/dashboard");
    else if (data.role === "owner") router.push("/owner/dashboard");
    else router.push("/owner/create");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError(error.message);
      }
      return;
    }

    // Email confirmation disabled on the project → already signed in.
    if (data.session) {
      await redirectByRole();
      return;
    }

    setStep("otp");
    setCooldown(60);
    setInfo(`We sent a 6-digit code to ${email}. Enter it below to verify your email.`);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: "signup",
    });
    setLoading(false);

    if (error || !data.session) {
      setError(
        error?.message ||
          "Verification failed. Check the code and try again."
      );
      return;
    }

    await redirectByRole();
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError("");
    setInfo("");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) {
      setError(error.message);
      return;
    }
    setCooldown(60);
    setInfo(`A new code was sent to ${email}.`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        margin: "0 24px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "48px 40px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <Building2 style={{ color: "white", width: "32px", height: "32px" }} />
          </div>
          <h1 style={{ color: "white", fontSize: "24px", fontWeight: 700, margin: "0 0 6px" }}>
            {step === "form" ? "Create your free card" : "Verify your email"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            {step === "form"
              ? "Sign up free — your first digital card is on us."
              : "Enter the 6-digit code we emailed you."}
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 14px", color: "#fca5a5", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}
        {info && (
          <div style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: "10px", padding: "12px 14px", color: "#7dd3fc", fontSize: "13px", marginBottom: "16px" }}>
            {info}
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", width: "16px", height: "16px" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", width: "16px", height: "16px" }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Confirm password</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", width: "16px", height: "16px" }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "13px", background: loading ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg, #0ea5e9, #8b5cf6)", border: "none", borderRadius: "12px", color: "white", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}
            >
              {loading && <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />}
              {loading ? "Creating account..." : "Sign up free"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>6-digit code</label>
              <div style={{ position: "relative" }}>
                <ShieldCheck style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", width: "16px", height: "16px" }} />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "white", fontSize: "20px", letterSpacing: "8px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{ width: "100%", padding: "13px", background: loading || otp.length !== 6 ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg, #0ea5e9, #8b5cf6)", border: "none", borderRadius: "12px", color: "white", fontSize: "15px", fontWeight: 600, cursor: loading || otp.length !== 6 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}
            >
              {loading && <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />}
              {loading ? "Verifying..." : "Verify & continue"}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              style={{ background: "none", border: "none", color: cooldown > 0 ? "rgba(255,255,255,0.3)" : "#0ea5e9", fontSize: "13px", cursor: cooldown > 0 ? "not-allowed" : "pointer", padding: "4px" }}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get the code? Resend it"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "24px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#0ea5e9", textDecoration: "none" }}>Log in →</a>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
}
