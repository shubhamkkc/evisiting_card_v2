import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Plus } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-bold text-lg text-blue-600">EVisitingCard</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/businesses/new" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
            <Plus className="w-5 h-5" />
            New Card
          </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sm:px-10">
          <h1 className="font-semibold text-gray-800">Hello, {session?.user?.name ?? "Admin"}</h1>
          <a href="/api/auth/signout" className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors">
            Logout <LogOut className="w-4 h-4" />
          </a>
        </header>
        <div className="flex-1 overflow-auto p-6 sm:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
