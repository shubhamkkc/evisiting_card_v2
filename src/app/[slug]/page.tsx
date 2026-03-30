import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BusinessCard from "@/components/card/BusinessCard";
import { Metadata } from "next";
import Link from "next/link";
import { Edit3 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
  });

  if (!business) {
    return { title: "Not Found" };
  }

  return {
    title: `${business.businessName} | Digital Business Card`,
    description: business.about?.substring(0, 160) || `Digital business card for ${business.businessName}`,
    manifest: `/api/${slug}/manifest`,
    icons: {
      icon: business.logo || "/favicon.ico",
      apple: business.logo || "/favicon.ico",
    },
    openGraph: {
      images: business.logo ? [business.logo] : [],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params;

  const [business, session] = await Promise.all([
    prisma.business.findFirst({ where: { slug, isActive: true } }),
    getServerSession(authOptions),
  ]);

  if (!business) {
    notFound();
  }

  const isOwner =
    (session?.user as any)?.role === "owner" &&
    (session?.user as any)?.businessId === business.id;

  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pb-20">
      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-2xl overflow-hidden">
        <BusinessCard business={business as any} />

        {/* Floating Edit Button — visible to owner of this card or admin */}
        {(isOwner || isAdmin) && (
          <Link
            href={isAdmin ? `/admin/businesses/${business.id}/edit` : "/owner/edit"}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: isAdmin
                ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                : "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              color: "white",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              zIndex: 9999,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <Edit3 style={{ width: "16px", height: "16px" }} />
            {isAdmin ? "Admin: Edit Card" : "Edit My Card"}
          </Link>
        )}
      </main>
    </div>
  );
}
