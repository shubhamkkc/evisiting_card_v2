"use client";

import Link from "next/link";
import { Copy, Eye, Edit2, CheckCircle2, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function BusinessTable({ businesses }: { businesses: any[] }) {
  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <Toaster />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Business</th>
              <th className="px-6 py-4">URL Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">No business cards found.</td>
              </tr>
            )}
            {businesses.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {b.businessName}
                  {b.ownerName && <span className="block text-xs text-gray-500 font-normal">{b.ownerName}</span>}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-mono text-xs border border-blue-100">/{b.slug}</span>
                </td>
                <td className="px-6 py-4">
                  {b.isActive ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium text-xs"><CheckCircle2 className="w-4 h-4" /> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 font-medium text-xs"><XCircle className="w-4 h-4" /> Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3 text-gray-400">
                    <button onClick={() => copyLink(b.slug)} className="hover:text-blue-600 transition" title="Copy Link">
                      <Copy className="w-4 h-4" />
                    </button>
                    <a href={`/${b.slug}`} target="_blank" rel="noreferrer" className="hover:text-green-600 transition" title="View Card">
                      <Eye className="w-4 h-4" />
                    </a>
                    <Link href={`/admin/businesses/${b.id}/edit`} className="hover:text-indigo-600 transition" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
