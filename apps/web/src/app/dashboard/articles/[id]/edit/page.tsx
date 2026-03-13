"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArticleEditor, type ArticleFormData } from "@/components/blog/article-editor";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  featuredImage?: string;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  readingTime?: string;
  rejectionReason?: string;
}

export default function EditArticlePage() {
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
        toast.error("Failed to load article");
        router.push("/dashboard/articles");
      });
  }, [id, router]);

  const handleSave = async (data: ArticleFormData, action: "draft" | "submit" | "publish") => {
    const res = await fetch(`${API_BASE}/api/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        featuredImage: data.featuredImage || undefined,
        tags: data.tags.join(", "),
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        readingTime: data.readingTime || undefined,
        status: action === "submit" ? "pending" : "draft",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      toast.error(err.error || "Failed to save article");
      throw new Error(err.error);
    }

    toast.success(action === "submit" ? "Submitted for review!" : "Changes saved!");
    router.push("/dashboard/articles");
  };

  const handleDelete = async () => {
    const res = await fetch(`${API_BASE}/api/blog/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Article deleted.");
      router.push("/dashboard/articles");
    } else {
      toast.error("Failed to delete article");
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

  return (
    <ArticleEditor
      mode="edit"
      isAdmin={false}
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage ?? "",
        tags: post.tags ? post.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        metaTitle: post.metaTitle ?? "",
        metaDescription: post.metaDescription ?? "",
        readingTime: post.readingTime ?? "",
        currentStatus: post.status,
        rejectionReason: post.rejectionReason,
      }}
      onSave={handleSave}
      showDeleteButton={post.status === "draft" || post.status === "rejected"}
      onDelete={handleDelete}
      backHref="/dashboard/articles"
    />
  );
}
