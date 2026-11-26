import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import OwnerCreateForm from "@/components/owner/OwnerCreateForm";
import { Building2 } from "lucide-react";

export default async function OwnerCreatePage() {
  const session = await getSession();

  if (!session) redirect("/owner/login");
  if (session.role === "admin") redirect("/admin/dashboard");
  if (session.businessId) redirect("/owner/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        margin: "40px 24px",
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
            Create your card
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            Your email is verified. Tell us about your business — your card goes live right away.
          </p>
        </div>

        <OwnerCreateForm />
      </div>
    </div>
  );
}
