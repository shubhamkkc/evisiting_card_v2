import BusinessForm from "@/components/admin/BusinessForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await prisma.business.findUnique({
    where: { id }
  });

  if (!business) {
    notFound();
  }

  // Parse JSON fields to objects
  const initialData = {
    ...business,
    socialLinks: business.socialLinks ? JSON.parse(business.socialLinks as string) : {},
    services: business.services ? JSON.parse(business.services as string) : [],
    gallery: business.gallery ? JSON.parse(business.gallery as string) : [],
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Digital Card</h1>
        <p className="text-gray-500">Update details for {business.businessName}</p>
      </div>

      <BusinessForm initialData={initialData} />
    </div>
  );
}
