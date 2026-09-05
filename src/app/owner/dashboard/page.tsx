import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Edit3, ExternalLink, LogOut, Building2, Phone, Mail, Globe, MapPin, CheckCircle, XCircle } from "lucide-react";

export default async function OwnerDashboardPage() {
  const session = await getServerSession(authOptions);
  const businessId = (session?.user as any)?.businessId;

  if (!businessId) redirect("/owner/login");

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) redirect("/owner/login");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%)" }}>
      {/* Header */}
      <header style={{
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building2 style={{ color: "white", width: "18px", height: "18px" }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>{business.businessName}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>Owner Dashboard</div>
          </div>
        </div>
        <a
          href="/api/auth/signout"
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", textDecoration: "none", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", transition: "all 0.2s" }}
        >
          <LogOut style={{ width: "14px", height: "14px" }} />
          Logout
        </a>
      </header>

      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
            Welcome back! 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
            Manage your digital business card from here.
          </p>
        </div>

        {/* Status Banner */}
        <div style={{
          background: business.isActive
            ? "linear-gradient(135deg, #dcfce7, #f0fdf4)"
            : "linear-gradient(135deg, #fee2e2, #fff5f5)",
          border: `1px solid ${business.isActive ? "#86efac" : "#fca5a5"}`,
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
        }}>
          {business.isActive
            ? <CheckCircle style={{ color: "#22c55e", width: "20px", height: "20px", flexShrink: 0 }} />
            : <XCircle style={{ color: "#ef4444", width: "20px", height: "20px", flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: business.isActive ? "#15803d" : "#dc2626" }}>
              {business.isActive ? "Your card is live and visible to the public" : "Your card is currently deactivated"}
            </div>
            <div style={{ fontSize: "12px", color: business.isActive ? "#4ade80" : "#f87171", marginTop: "2px" }}>
              {business.isActive ? `Accessible at /${business.slug}` : "Contact your administrator to reactivate"}
            </div>
          </div>
        </div>

        {/* Card Preview + Actions */}
        <div style={{
          background: "white",
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          marginBottom: "24px",
        }}>
          {/* Cover */}
          <div style={{
            height: "120px",
            background: business.coverPhoto
              ? `url(${business.coverPhoto}) center/cover`
              : `linear-gradient(135deg, ${business.themeColor}33, ${business.themeColor}66)`,
            position: "relative",
          }}>
            {business.logo && (
              <img
                src={business.logo}
                alt="logo"
                style={{ position: "absolute", bottom: "-30px", left: "24px", width: "60px", height: "60px", borderRadius: "12px", border: "3px solid white", objectFit: "contain", background: "white" }}
              />
            )}
          </div>
          <div style={{ padding: "44px 24px 24px" }}>
            <h2 style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", margin: "0 0 2px" }}>{business.businessName}</h2>
            {business.ownerName && <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 16px" }}>{business.ownerName}{business.designation ? ` · ${business.designation}` : ""}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {business.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "13px" }}>
                  <Phone style={{ width: "14px", height: "14px", color: "#94a3b8" }} /> {business.phone}
                </div>
              )}
              {business.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "13px" }}>
                  <Mail style={{ width: "14px", height: "14px", color: "#94a3b8" }} /> {business.email}
                </div>
              )}
              {business.website && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "13px" }}>
                  <Globe style={{ width: "14px", height: "14px", color: "#94a3b8" }} /> {business.website}
                </div>
              )}
              {business.address && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontSize: "13px" }}>
                  <MapPin style={{ width: "14px", height: "14px", color: "#94a3b8" }} /> {business.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/owner/edit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 24px",
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
              flex: 1,
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(14,165,233,0.3)",
            }}
          >
            <Edit3 style={{ width: "16px", height: "16px" }} />
            Edit My Card
          </Link>
          {business.isActive && (
            <a
              href={`/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 24px",
                background: "white",
                color: "#374151",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
                border: "1px solid #e2e8f0",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <ExternalLink style={{ width: "16px", height: "16px" }} />
              View Live Card
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
