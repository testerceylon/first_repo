"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArticleEditor, type ArticleFormData } from "@/components/blog/article-editor";

// Use empty base so requests go through the Next.js proxy (/api/*),
// ensuring the session cookie (set on www.inicioofficial.com) is included.
const API_BASE = "";

interface AgentUser {
  id: string;
  name: string | null;
  email: string;
  postCount: number;
}

export default function AdminEditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [agentUsers, setAgentUsers] = useState<AgentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`${API_BASE}/api/blog/${id}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`${API_BASE}/api/admin/blog/authors`, { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([postData, authorsData]) => {
        setPost(postData.post);
        setAgentUsers(authorsData.authors ?? []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load article");
        router.push("/admin/articles");
      });
  }, [id, router]);

  const handleSave = async (data: ArticleFormData) => {
    const res = await fetch(`${API_BASE}/api/blog/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to save");
    }
    toast.success("Article saved!");
    router.push("/admin/articles");
  };

  const handleDelete = async () => {
    await fetch(`${API_BASE}/api/blog/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    toast.success("Article deleted.");
    router.push("/admin/articles");
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
      initialData={post}
      mode="edit"
      isAdmin
      agentUsers={agentUsers}
      onSave={handleSave}
      backHref="/admin/articles"
      showDeleteButton
      onDelete={handleDelete}
    />
  );
}
