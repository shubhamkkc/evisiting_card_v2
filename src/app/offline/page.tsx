"use client";

import { useState } from "react";

// Offline fallback page served by the service worker when a business card
// cannot be reached (network-first navigation fails). Static, no DB access.
export default function OfflinePage() {
  const [retrying, setRetrying] = useState(false);
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
        background: "#F3F3F1",
        color: "#000000",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "#D2E823",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        !
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>You&apos;re offline</h1>
      <p style={{ fontSize: 16, lineHeight: 1.5, color: "#676B5F", maxWidth: 340, margin: 0 }}>
        This business card needs an internet connection to load. Please check
        your connection and try again.
      </p>
      <button
        type="button"
        onClick={() => {
          setRetrying(true);
          window.location.reload();
        }}
        style={{
          display: "inline-flex",
          minHeight: 56,
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 32px",
          borderRadius: 9999,
          background: "#000000",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        {retrying ? "Retrying…" : "Try again"}
      </button>
      <p style={{ fontSize: 12, color: "#676B5F", margin: 0 }}>Powered by EVisitingCard</p>
    </main>
  );
}
