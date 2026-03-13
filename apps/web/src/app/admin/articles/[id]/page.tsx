"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  Tag,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "pending" | "approved" | "rejected";
  authorId: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string;
  readingTime?: string;
  views?: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// Use empty base so requests go through the Next.js proxy (/api/*),
// ensuring the session cookie (set on www.inicioofficial.com) is included.
const BASE = "";

export default function AdminArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`${BASE}/api/blog/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch article");
      const data = await res.json();
      setPost(data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this article?")) return;
    
    try {
      const res = await fetch(`${BASE}/api/blog/${id}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to approve article");
      fetchPost();
      alert("Article approved successfully!");
    } catch (error) {
      console.error("Error approving post:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Reason for rejection (optional):");
    if (reason === null) return; // User cancelled
    
    try {
      const res = await fetch(`${BASE}/api/blog/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to reject article");
      fetchPost();
      alert("Article rejected.");
    } catch (error) {
      console.error("Error rejecting post:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await fetch(`${BASE}/api/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete article");
      alert("Article deleted successfully!");
      router.push("/admin/articles");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/articles/edit/${id}`);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { icon: FileText, color: "bg-gray-100 text-gray-700 border-gray-200" },
      pending: { icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      approved: { icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200" },
      rejected: { icon: XCircle, color: "bg-red-100 text-red-700 border-red-200" },
    }[status] || { icon: FileText, color: "bg-gray-100 text-gray-700 border-gray-200" };

    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading article...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">Error: {error || "Article not found"}</p>
          <Button onClick={() => router.back()} className="mt-4" variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Article Details</h1>
            <p className="text-gray-600">Review article content and metadata</p>
          </div>
          <div>{getStatusBadge(post.status)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex-wrap"
      >
        <Button
          onClick={handleEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Article
        </Button>
        {post.status !== "approved" && (
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve Article
          </Button>
        )}
        {post.status !== "rejected" && (
          <Button
            onClick={handleReject}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            <X className="w-4 h-4 mr-2" />
            Reject Article
          </Button>
        )}
        <Button
          onClick={handleDelete}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Article
        </Button>
      </motion.div>

      {/* Rejection Reason */}
      {post.rejectionReason && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-2">Rejection Reason</h3>
          <p className="text-red-700">{post.rejectionReason}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white border rounded-lg shadow-sm">
        {/* Article Header */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>Author ID: {post.authorId.slice(0, 8)}...</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime}</span>
              </div>
            )}
            {post.views && (
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-4 h-4" />
                <span>{post.views} views</span>
              </div>
            )}
            {post.tags && (
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-4 h-4" />
                <span>{post.tags}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="p-6 border-b">
            <h3 className="font-semibold mb-2">Featured Image</h3>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="max-w-md rounded-lg border"
            />
          </div>
        )}

        {/* Excerpt */}
        <div className="p-6 border-b">
          <h3 className="font-semibold mb-2">Excerpt</h3>
          <p className="text-gray-700">{post.excerpt}</p>
        </div>

        {/* Content */}
        <div className="p-6 border-b">
          <h3 className="font-semibold mb-3">Content</h3>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded border text-sm">
              {post.content}
            </pre>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="p-6">
          <h3 className="font-semibold mb-3">SEO & Metadata</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700">Slug:</span>{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{post.slug}</code>
            </div>
            {post.metaTitle && (
              <div>
                <span className="font-medium text-gray-700">Meta Title:</span>{" "}
                <span className="text-gray-600">{post.metaTitle}</span>
              </div>
            )}
            {post.metaDescription && (
              <div>
                <span className="font-medium text-gray-700">Meta Description:</span>{" "}
                <span className="text-gray-600">{post.metaDescription}</span>
              </div>
            )}
            {post.publishedAt && (
              <div>
                <span className="font-medium text-gray-700">Published At:</span>{" "}
                <span className="text-gray-600">
                  {new Date(post.publishedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons at Bottom */}
      <div className="mt-6 flex gap-3 flex-wrap">
        <Button
          onClick={handleEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Article
        </Button>
        {post.status !== "approved" && (
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Approve Article
          </Button>
        )}
        {post.status !== "rejected" && (
          <Button
            onClick={handleReject}
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            <X className="w-4 h-4 mr-2" />
            Reject Article
          </Button>
        )}
        <Button
          onClick={handleDelete}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Article
        </Button>
      </div>
    </div>
  );
}
