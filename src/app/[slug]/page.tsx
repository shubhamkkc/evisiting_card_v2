import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BusinessCard from "@/components/card/BusinessCard";
import { Metadata } from "next";

interface Props {
  params: { slug: string };
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
    openGraph: {
      images: business.logo ? [business.logo] : [],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { slug } = await params;
  const business = await prisma.business.findFirst({
    where: { slug, isActive: true },
  });

  if (!business) {
    notFound();
  }

  // Ensure JSON fields are parsed correctly if needed, though Prisma does this automatically for Json types
  
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pb-20">
      <main className="w-full max-w-[430px] bg-white min-h-screen relative shadow-2xl overflow-hidden">
        <BusinessCard business={business as any} />
      </main>
    </div>
  );
}
