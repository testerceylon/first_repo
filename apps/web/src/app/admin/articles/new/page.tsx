"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArticleEditor, type ArticleFormData } from "@/components/blog/article-editor";

// Use empty base so requests go through the Next.js proxy (/api/*),
// ensuring the session cookie (set on www.inicioofficial.com) is included.
const API_BASE = "";

interface AgentUser {
  id: string;
  name: string | null;
  email: string;
}

export default function AdminNewArticlePage() {
  const router = useRouter();
  const [agentUsers, setAgentUsers] = useState<AgentUser[]>([]);

  useEffect(() => {
    // Fetch agent users for author override
    fetch(`${API_BASE}/api/admin/blog/authors`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setAgentUsers(data.authors ?? []))
      .catch(() => {});
  }, []);

  const handleSave = async (data: ArticleFormData, action: "draft" | "submit" | "publish") => {
    const status = action === "publish" ? "approved" : action === "draft" ? "draft" : data.status ?? "draft";

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
        status,
        publishedAt: action === "publish" ? data.publishedAt : undefined,
        authorId: data.authorId || undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      toast.error(err.error || "Failed to create article");
      throw new Error(err.error);
    }

    if (action === "publish") {
      toast.success("Article published!");
    } else {
      toast.success("Draft saved!");
    }
    router.push("/admin/articles");
  };

  return (
    <ArticleEditor
      mode="create"
      isAdmin={true}
      agentUsers={agentUsers}
      onSave={handleSave}
      backHref="/admin/articles"
    />
  );
}
