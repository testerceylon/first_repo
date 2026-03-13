"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-[#2a2a2a] text-[#a0a0a0]",
  pending: "bg-yellow-900/50 text-yellow-300",
  approved: "bg-green-900/50 text-green-300",
  rejected: "bg-red-900/50 text-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "DRAFT",
  pending: "UNDER REVIEW",
  approved: "LIVE",
  rejected: "REJECTED",
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  featuredImage?: string;
  tags?: string;
  readingTime?: string;
  createdAt: string;
  author?: { name?: string };
}

export default function ArticlePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/blog/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setPost(data.post);
        setLoading(false);
      })
      .catch(() => {
        router.push("/dashboard/articles");
      });
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#aaff00] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) return null;

  const tags = post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#111] border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard/articles")}
          className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Articles
        </button>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[post.status] ?? "bg-[#2a2a2a] text-[#a0a0a0]"}`}>
            {STATUS_LABELS[post.status] ?? post.status.toUpperCase()}
          </span>
          {post.status === "approved" && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-700 text-white rounded hover:bg-green-600 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Live
            </a>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Featured Image */}
        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-8 border border-[#2a2a2a]"
          />
        )}

        {/* Tags & Meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-[#aaff00]/10 border border-[#aaff00]/30 text-[#aaff00] rounded text-xs font-medium">
              {tag}
            </span>
          ))}
          {post.readingTime && (
            <span className="text-[#a0a0a0] text-xs">{post.readingTime}</span>
          )}
          <span className="text-[#555] text-xs">
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold font-[Rajdhani] leading-tight mb-6">{post.title}</h1>

        {/* Excerpt */}
        <p className="text-[#a0a0a0] text-lg italic mb-8 border-l-4 border-[#aaff00] pl-4">{post.excerpt}</p>

        {/* Content */}
        <div className="prose prose-invert prose-gaming max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
