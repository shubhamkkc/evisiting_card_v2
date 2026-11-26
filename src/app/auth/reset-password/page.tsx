"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, KeyRound, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let alive = true;
    const finish = () => {
      if (alive) setChecking(false);
    };

    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const linkError = params.get("error_description") || params.get("error");
      if (linkError) {
        if (alive) {
          setError(decodeURIComponent(linkError));
          finish();
        }
        return;
      }

      // 1. PKCE links arrive with ?code= — exchange it for a session.
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!alive) return;
        if (!error) {
          setHasSession(true);
          finish();
          return;
        }
      }

      // 2. Implicit links arrive with #access_token=... — the browser
      // client picks the session up from the URL hash automatically.
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      if (data.session) {
        setHasSession(true);
        finish();
        return;
      }

      // 3. Hash detection can land a moment later — listen for it,
      // then stop waiting after a few seconds.
      const { data: sub } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session && alive) {
            setHasSession(true);
            finish();
          }
        }
      );
      setTimeout(() => {
        sub.subscription.unsubscribe();
        finish();
      }, 5000);
    };

    run();
    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

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
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
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
            <KeyRound style={{ color: "white", width: "32px", height: "32px" }} />
          </div>
          <h1 style={{ color: "white", fontSize: "24px", fontWeight: 700, margin: "0 0 6px" }}>
            Choose a new password
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            {done ? "Your password has been updated." : "Enter a new password for your account."}
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 14px", color: "#fca5a5", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {checking ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "rgba(255,255,255,0.6)", fontSize: "14px", padding: "24px 0" }}>
            <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
            Checking your reset link…
          </div>
        ) : done ? (
          <div>
            <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "10px", padding: "12px 14px", color: "#86efac", fontSize: "13px", marginBottom: "16px" }}>
              Password updated. You can now log in with your new password.
            </div>
            <a
              href="/login"
              style={{ display: "block", textAlign: "center", width: "100%", padding: "13px", background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)", borderRadius: "12px", color: "white", fontSize: "15px", fontWeight: 600, textDecoration: "none", boxSizing: "border-box" }}
            >
              Log in →
            </a>
          </div>
        ) : !hasSession ? (
          <div>
            <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 14px", color: "#fca5a5", fontSize: "13px", marginBottom: "16px" }}>
              This reset link is invalid or has expired. Request a new one from the forgot-password page.
            </div>
            <a
              href="/forgot-password"
              style={{ display: "block", textAlign: "center", width: "100%", padding: "13px", background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)", borderRadius: "12px", color: "white", fontSize: "15px", fontWeight: 600, textDecoration: "none", boxSizing: "border-box" }}
            >
              Request a new reset link →
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>New password</label>
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
              <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Confirm new password</label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", width: "16px", height: "16px" }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
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
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "24px" }}>
          <a href="/login" style={{ color: "#0ea5e9", textDecoration: "none" }}>Back to login →</a>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
}
