import prisma from "@/lib/prisma";
import BusinessTable from "@/components/admin/BusinessTable";

export default async function DashboardPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Manage all your digital business cards here.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <BusinessTable businesses={businesses} />
      </div>
    </div>
  );
}
