import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import OwnerBusinessForm from "@/components/owner/OwnerBusinessForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function OwnerEditPage() {
  const session = await getServerSession(authOptions);
  const businessId = (session?.user as any)?.businessId;

  if (!businessId) redirect("/owner/login");

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) notFound();

  const initialData = {
    ...business,
    socialLinks: business.socialLinks ? JSON.parse(business.socialLinks as string) : [],
    services: business.services ? JSON.parse(business.services as string) : [],
    gallery: business.gallery ? JSON.parse(business.gallery as string) : [],
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
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
        <Link href="/owner/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#374151", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Back to Dashboard
        </Link>
        <a
          href="/api/auth/signout"
          style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "none" }}
        >
          Logout
        </a>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>Edit My Card</h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Update the details for <strong>{business.businessName}</strong>
          </p>
        </div>
        <OwnerBusinessForm initialData={initialData} />
      </main>
    </div>
  );
}
