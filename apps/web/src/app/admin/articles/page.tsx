"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus, FileText, Edit, Trash2, Check, X, Eye, Clock, AlertCircle, Search, Loader2, Filter,
} from "lucide-react";
import { toast } from "sonner";

// Use empty base so requests go through the Next.js proxy (/api/*),
// ensuring the session cookie (set on www.inicioofficial.com) is included.
const API_BASE = "";

type TabStatus = "all" | "pending" | "approved" | "draft" | "rejected";

interface Author {
  id: string;
  name?: string | null;
  email: string;
  postCount: number;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  tags?: string;
  views?: string;
  createdAt: string;
  authorId: string;
  author?: { id: string; name?: string | null; email: string };
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-[#2a2a2a] text-[#a0a0a0] border-[#3a3a3a]",
  pending: "bg-yellow-900/30 text-yellow-300 border-yellow-800",
  approved: "bg-green-900/30 text-green-400 border-green-800",
  rejected: "bg-red-900/30 text-red-400 border-red-800",
};

const TABS: { key: TabStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "draft", label: "Drafts" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminArticlesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReasonMap, setRejectReasonMap] = useState<Record<string, string>>({});
  const [showRejectInputFor, setShowRejectInputFor] = useState<string | null>(null);

  const fetchPosts = useCallback((tab: TabStatus, authorId?: string, q?: string) => {
    const params = new URLSearchParams();
    if (tab !== "all") params.set("status", tab);
    if (authorId) params.set("authorId", authorId);
    if (q) params.set("search", q);
    setLoading(true);
    fetch(`${API_BASE}/api/admin/blog?${params}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load articles");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPosts(activeTab, authorFilter, search);
  }, [activeTab, authorFilter, fetchPosts]);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/blog/authors`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setAuthors(data.authors ?? []))
      .catch(() => {});
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") fetchPosts(activeTab, authorFilter, search);
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/blog/${id}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      toast.success("Article approved & published!");
      fetchPosts(activeTab, authorFilter, search);
    } catch {
      toast.error("Approve failed");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = rejectReasonMap[id]?.trim();
    if (!reason) { toast.error("Provide a rejection reason"); return; }
    setRejectingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/blog/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error();
      toast.success("Article rejected.");
      setShowRejectInputFor(null);
      setRejectReasonMap((m) => { const next = { ...m }; delete next[id]; return next; });
      fetchPosts(activeTab, authorFilter, search);
    } catch {
      toast.error("Reject failed");
    } finally {
      setRejectingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`${API_BASE}/api/blog/${deleteId}`, { method: "DELETE", credentials: "include" });
      toast.success("Article deleted.");
      setDeleteId(null);
      fetchPosts(activeTab, authorFilter, search);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const pendingCount = posts.filter((p) => p.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[Rajdhani] flex items-center gap-3">
            ARTICLES
            {pendingCount > 0 && activeTab !== "pending" && (
              <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded-full font-medium">
                {pendingCount} pending
              </span>
            )}
          </h1>
          <p className="text-[#a0a0a0] text-sm mt-0.5">Manage all community articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#aaff00] text-black font-bold rounded hover:bg-[#88cc00] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Filters row */}
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
              {tab.key === "pending" && pendingCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-600 text-white">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 py-2">
          {/* Author filter */}
          {authors.length > 0 && (
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
              <select
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-[#a0a0a0] focus:border-[#aaff00]/50 focus:outline-none appearance-none"
              >
                <option value="">All Authors</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name ?? a.email}</option>
                ))}
              </select>
            </div>
          )}
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search articles..."
              className="pl-9 pr-4 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm placeholder-[#555] focus:border-[#aaff00]/50 focus:outline-none w-52"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#aaff00]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-12 h-12 text-[#2a2a2a] mb-4" />
            <p className="text-[#a0a0a0] text-lg">No articles found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 hover:border-[#2a2a2a] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold">{post.title}</h3>
                      <span className={`text-xs px-2 py-0.5 border rounded font-medium ${STATUS_COLORS[post.status] ?? ""}`}>
                        {post.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#555]">
                      <span className="text-[#a0a0a0]">
                        {post.author?.name ?? post.author?.email ?? "Unknown"}
                      </span>
                      {post.tags && <span>{post.tags.split(",").slice(0, 3).join(", ")}</span>}
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views ?? 0}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                    {post.status === "pending" && (
                      <>
                        <Link
                          href={`/admin/articles/${post.id}/review`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm hover:border-white transition-colors"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                          Review
                        </Link>
                        <button
                          onClick={() => handleApprove(post.id)}
                          disabled={approvingId === post.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 border border-green-800 text-green-400 rounded text-sm hover:bg-green-900/50 transition-colors disabled:opacity-50"
                        >
                          {approvingId === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Quick Approve
                        </button>
                        <button
                          onClick={() => setShowRejectInputFor(showRejectInputFor === post.id ? null : post.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-900/20 border border-red-800 text-red-400 rounded text-sm hover:bg-red-900/40 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}

                    {post.status === "approved" && (
                      <>
                        <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm hover:border-white transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Link>
                        <Link href={`/admin/articles/${post.id}/edit`} className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm hover:border-[#aaff00] transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      </>
                    )}

                    {post.status === "draft" && (
                      <>
                        <Link href={`/admin/articles/${post.id}/edit`} className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm hover:border-[#aaff00] transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleApprove(post.id)}
                          disabled={approvingId === post.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#aaff00]/10 border border-[#aaff00]/30 text-[#aaff00] rounded text-sm hover:bg-[#aaff00]/20 transition-colors disabled:opacity-50"
                        >
                          {approvingId === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Approve
                        </button>
                      </>
                    )}

                    {post.status === "rejected" && (
                      <Link href={`/admin/articles/${post.id}/edit`} className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm hover:border-[#aaff00] transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                    )}

                    <button
                      onClick={() => setDeleteId(post.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline reject form */}
                {showRejectInputFor === post.id && (
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex gap-2 items-end">
                    <textarea
                      value={rejectReasonMap[post.id] ?? ""}
                      onChange={(e) => setRejectReasonMap((m) => ({ ...m, [post.id]: e.target.value }))}
                      placeholder="Rejection reason..."
                      rows={2}
                      className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-red-800 rounded text-white placeholder-[#555] text-sm resize-none focus:border-red-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleReject(post.id)}
                      disabled={rejectingId === post.id}
                      className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {rejectingId === post.id && <Loader2 className="w-3 h-3 animate-spin" />}
                      Confirm
                    </button>
                  </div>
                )}
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
