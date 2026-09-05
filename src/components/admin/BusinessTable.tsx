"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Eye, Edit2, CheckCircle2, XCircle, Trash2, AlertTriangle, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function BusinessTable({ businesses }: { businesses: any[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    toast.success("Link copied to clipboard!");
  };

  const getDaysAgo = (date: string) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/businesses/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Business deleted successfully");
        setDeleteId(null);
        setConfirmText("");
        router.refresh();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting business");
    } finally {
      setIsDeleting(false);
    }
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
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">No business cards found.</td>
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
                <td className="px-6 py-4 text-xs font-medium">
                  {getDaysAgo(b.createdAt)}
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
                    <button 
                      onClick={() => setDeleteId(b.id)} 
                      className="hover:text-red-600 transition" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button 
                onClick={() => { setDeleteId(null); setConfirmText(""); }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Delete Business Card?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              This action is permanent and cannot be undone. All business data, services, and gallery images link will be removed.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Type <span className="text-red-600">DELETE</span> to confirm
              </label>
              <input 
                type="text" 
                autoFocus
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-bold tracking-widest text-center uppercase"
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setDeleteId(null); setConfirmText(""); }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={confirmText !== "DELETE" || isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
