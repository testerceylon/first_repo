"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArticleEditor, type ArticleFormData } from "@/components/blog/article-editor";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NewArticlePage() {
  const router = useRouter();

  const handleSave = async (data: ArticleFormData, action: "draft" | "submit" | "publish") => {
    const res = await fetch(`${API_BASE}/api/blog`, {
      method: "POST",
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
        status: data.status ?? (action === "draft" ? "draft" : "pending"),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      toast.error(err.error || "Failed to save article");
      throw new Error(err.error);
    }

    toast.success(action === "draft" ? "Draft saved!" : "Submitted for review!");
    router.push("/dashboard/articles");
  };

  return (
    <ArticleEditor
      mode="create"
      isAdmin={false}
      onSave={handleSave}
      backHref="/dashboard/articles"
    />
  );
}


