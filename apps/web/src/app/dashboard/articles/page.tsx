"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, FileText, Edit, Trash2, Send, Eye, Clock, CheckCircle, Search, Loader2,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Status = "all" | "draft" | "pending" | "approved" | "rejected";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  tags?: string;
  views?: string;
  createdAt: string;
  rejectionReason?: string;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending: "Under Review",
  approved: "Live",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-[#2a2a2a] text-[#a0a0a0] border-[#3a3a3a]",
  pending: "bg-yellow-900/30 text-yellow-300 border-yellow-800",
  approved: "bg-green-900/30 text-green-400 border-green-800",
  rejected: "bg-red-900/30 text-red-400 border-red-800",
};

const TABS: { key: Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "pending", label: "Under Review" },
  { key: "approved", label: "Live" },
  { key: "rejected", label: "Rejected" },
];

export default function DashboardArticlesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Status>("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitId, setSubmitId] = useState<string | null>(null);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/blog/mine`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load articles");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Client-side filtering — counts are always from the full posts list
  const counts: Record<string, number> = { all: posts.length, draft: 0, pending: 0, approved: 0, rejected: 0 };
  posts.forEach((p) => {
    if (counts[p.status] !== undefined) counts[p.status]++;
  });

  const filtered = posts.filter((p) => {
    const matchesTab = activeTab === "all" || p.status === activeTab;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`${API_BASE}/api/blog/${deleteId}`, { method: "DELETE", credentials: "include" });
      toast.success("Article deleted.");
      setDeleteId(null);
      fetchPosts();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (id: string) => {
    setSubmitId(id);
    try {
      const res = await fetch(`${API_BASE}/api/blog/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "pending" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Submitted for review!");
      fetchPosts();
    } catch {
      toast.error("Submit failed");
    } finally {
      setSubmitId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[Rajdhani]">MY ARTICLES</h1>
          <p className="text-[#a0a0a0] text-sm mt-0.5">Create and manage your content</p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#aaff00] text-black font-bold rounded hover:bg-[#88cc00] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Tabs + Search */}
      <div className="border-b border-[#1a1a1a] px-6 flex items-center justify-between">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? "border-[#aaff00] text-[#aaff00]"
                  : "border-transparent text-[#a0a0a0] hover:text-white"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${activeTab === tab.key ? "bg-[#aaff00]/20 text-[#aaff00]" : "bg-[#2a2a2a] text-[#555]"}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative py-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="pl-9 pr-4 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm placeholder-[#555] focus:border-[#aaff00]/50 focus:outline-none w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#aaff00]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-12 h-12 text-[#2a2a2a] mb-4" />
            <p className="text-[#a0a0a0] text-lg">No articles yet</p>
            <p className="text-[#555] text-sm mt-1">Start writing your first article</p>
            <Link href="/dashboard/articles/new" className="mt-4 px-4 py-2 bg-[#aaff00] text-black font-bold rounded text-sm">
              Create Article
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => (
              <div key={post.id} className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 hover:border-[#2a2a2a] transition-colors">
                {/* Rejection reason callout */}
                {post.status === "rejected" && post.rejectionReason && (
                  <div className="mb-3 px-3 py-2 bg-red-900/20 border border-red-800 rounded text-red-300 text-sm">
                    <span className="font-semibold">Rejection reason:</span> {post.rejectionReason}
                  </div>
                )}
                {/* Pending lock message */}
                {post.status === "pending" && (
                  <div className="mb-3 px-3 py-2 bg-yellow-900/20 border border-yellow-800 rounded text-yellow-300 text-sm flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    This article is under review — editing is locked.
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">{post.title}</h3>
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 border rounded font-medium ${STATUS_COLORS[post.status] ?? ""}`}>
                        {STATUS_LABELS[post.status] ?? post.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#555]">
                      {post.tags && <span className="text-[#a0a0a0]">{post.tags.split(",").slice(0, 3).join(", ")}</span>}
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views ?? 0} views</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.status === "draft" && (
                      <>
                        <Link
                          href={`/dashboard/articles/${post.id}/edit`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm hover:border-[#aaff00] transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleSubmit(post.id)}
                          disabled={submitId === post.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#aaff00]/10 border border-[#aaff00]/30 text-[#aaff00] rounded text-sm hover:bg-[#aaff00]/20 transition-colors disabled:opacity-50"
                        >
                          {submitId === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          Submit
                        </button>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {post.status === "pending" && (
                      <Link
                        href={`/dashboard/articles/${post.id}/preview`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm hover:border-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </Link>
                    )}

                    {post.status === "approved" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 border border-green-800 text-green-400 rounded text-sm hover:bg-green-900/50 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        View Live
                      </Link>
                    )}

                    {post.status === "rejected" && (
                      <>
                        <Link
                          href={`/dashboard/articles/${post.id}/edit`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#aaff00]/10 border border-[#aaff00]/30 text-[#aaff00] rounded text-sm hover:bg-[#aaff00]/20 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit & Resubmit
                        </Link>
                        <button
                          onClick={() => setDeleteId(post.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Delete Article?</h3>
            <p className="text-[#a0a0a0] text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-[#2a2a2a] rounded text-[#a0a0a0] hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
