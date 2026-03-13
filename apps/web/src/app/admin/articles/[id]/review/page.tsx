"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check, X, User, Calendar, Tag, Clock, Eye, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

// Use empty base so requests go through the Next.js proxy (/api/*),
// ensuring the session cookie (set on www.inicioofficial.com) is included.
const API_BASE = "";

interface Author {
  id: string;
  name?: string | null;
  email: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  authorId: string;
  featuredImage?: string;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTime?: string;
  views?: string;
  createdAt: string;
  updatedAt?: string;
  author?: Author;
}

export default function AdminReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/blog/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setPost(data.post);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load article");
        router.push("/admin/articles");
      });
  }, [id, router]);

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await fetch(`${API_BASE}/api/blog/${id}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve");
      toast.success("Article published!");
      router.push("/admin/articles");
    } catch {
      toast.error("Failed to approve article");
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setRejecting(true);
    try {
      const res = await fetch(`${API_BASE}/api/blog/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      toast.success("Article rejected.");
      router.push("/admin/articles");
    } catch {
      toast.error("Failed to reject article");
      setRejecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#aaff00] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) return null;

  const tags = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#111] border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/articles")}
          className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>
        <span className="text-sm font-semibold text-yellow-300 bg-yellow-900/30 px-3 py-1 rounded">
          REVIEW MODE
        </span>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* LEFT: Article preview */}
        <div className="flex-1 overflow-y-auto p-8">
          {post.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-72 object-cover rounded-lg mb-8 border border-[#2a2a2a]"
            />
          )}

          {/* Tags & meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-[#aaff00]/10 border border-[#aaff00]/30 text-[#aaff00] rounded text-xs font-medium">
                {tag}
              </span>
            ))}
            {post.readingTime && <span className="text-[#a0a0a0] text-xs">{post.readingTime}</span>}
            <span className="text-[#555] text-xs">
              {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          <h1 className="text-4xl font-bold font-[Rajdhani] leading-tight mb-4">{post.title}</h1>
          <p className="text-[#a0a0a0] text-lg italic mb-8 border-l-4 border-[#aaff00] pl-4">{post.excerpt}</p>

          <div className="prose prose-invert prose-gaming max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>

        {/* RIGHT: Review sidebar */}
        <div className="w-[320px] flex-shrink-0 bg-[#111] border-l border-[#2a2a2a] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a0a0a0]">Article Details</h3>

            {/* Author */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#555] uppercase tracking-wider"><User className="w-3 h-3" />Author</div>
              <p className="text-white text-sm">{post.author?.name ?? post.author?.email ?? post.authorId}</p>
              {post.author?.name && <p className="text-[#a0a0a0] text-xs">{post.author.email}</p>}
            </div>

            {/* Submitted */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#555] uppercase tracking-wider"><Calendar className="w-3 h-3" />Submitted</div>
              <p className="text-white text-sm">{new Date(post.createdAt).toLocaleString()}</p>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#555] uppercase tracking-wider"><FileText className="w-3 h-3" />Status</div>
              <span className="inline-block px-2 py-0.5 bg-yellow-900/50 text-yellow-300 rounded text-xs font-semibold">
                {post.status.toUpperCase()}
              </span>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#555] uppercase tracking-wider"><Tag className="w-3 h-3" />Tags</div>
                <div className="flex flex-wrap gap-1">
                  {tags.map((t) => <span key={t} className="px-2 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] rounded text-xs">{t}</span>)}
                </div>
              </div>
            )}

            {/* Excerpt */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#555] uppercase tracking-wider">Excerpt</div>
              <p className="text-[#a0a0a0] text-sm">{post.excerpt}</p>
            </div>

            {/* SEO */}
            <div className="space-y-1 text-sm border-t border-[#2a2a2a] pt-4">
              <p><span className="text-[#555]">Meta Title:</span> <span className="text-[#a0a0a0]">{post.metaTitle ?? "—"}</span></p>
              <p><span className="text-[#555]">Meta Desc:</span> <span className="text-[#a0a0a0]">{post.metaDescription ?? "—"}</span></p>
              <p><span className="text-[#555]">Word Count:</span> <span className="text-[#a0a0a0]">{wordCount} words</span></p>
              <p><span className="text-[#555]">Read Time:</span> <span className="text-[#a0a0a0]">{post.readingTime ?? "—"}</span></p>
              <p><span className="text-[#555]">Views:</span> <span className="text-[#a0a0a0]">{post.views ?? "0"}</span></p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 border-t border-[#2a2a2a] space-y-3">
            <button
              onClick={handleApprove}
              disabled={approving || rejecting}
              className="w-full py-3 bg-[#aaff00] text-black font-bold rounded hover:bg-[#88cc00] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              APPROVE & PUBLISH
            </button>

            {!showRejectForm ? (
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={approving}
                className="w-full py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                REJECT
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain to the author what needs to be changed..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-red-800 rounded text-white placeholder-[#555] focus:border-red-500 focus:outline-none text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="flex-1 py-2 border border-[#2a2a2a] rounded text-[#a0a0a0] hover:text-white transition-colors text-sm"
                  >Cancel</button>
                  <button
                    onClick={handleReject}
                    disabled={rejecting || !rejectReason.trim()}
                    className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-1"
                  >
                    {rejecting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Confirm Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
