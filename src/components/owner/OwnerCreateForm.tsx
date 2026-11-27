"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Building2 } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function OwnerCreateForm() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onNameChange(value: string) {
    setBusinessName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/owner/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, phone, slug, ownerName, category }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not create your card. Please try again.");
      return;
    }

    router.push("/owner/dashboard");
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "8px",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {error && (
        <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 14px", color: "#fca5a5", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Business name *</label>
        <input
          required
          value={businessName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Smile Care Dental Studio"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Phone / WhatsApp *</label>
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. +91 98765 43210"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Your card link *</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
          <span style={{ padding: "12px 0 12px 16px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRight: "none", borderRadius: "12px 0 0 12px", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
            card.growxdigitech.com/
          </span>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            placeholder="your-business"
            style={{ ...inputStyle, borderRadius: "0 12px 12px 0", flex: 1 }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Your name</label>
        <input
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          placeholder="e.g. Dr. Ananya Sharma"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Dental Clinic, Photography, Salon"
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", padding: "13px", background: loading ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg, #0ea5e9, #8b5cf6)", border: "none", borderRadius: "12px", color: "white", fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}
      >
        {loading && <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />}
        {loading ? "Creating your card..." : "Create my card"}
      </button>

      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: 0 }}>
        Free plan — Theme 1, 1 service, 2 photos and 2 links. Paid (₹499/year) unlocks all themes (6+) and full limits.
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </form>
  );
}
