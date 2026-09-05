import BusinessForm from "@/components/admin/BusinessForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBusinessPage() {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Digital Card</h1>
        <p className="text-gray-500">Fill in the brand details below.</p>
      </div>

      <BusinessForm />
    </div>
  );
}
