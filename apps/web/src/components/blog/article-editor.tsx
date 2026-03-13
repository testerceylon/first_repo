"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Save, Send, Trash2, Globe, AlertTriangle, Check, X, Loader2 } from "lucide-react";

// Dynamic import to avoid SSR issues with @uiw/react-md-editor
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  readingTime: string;
  status?: string;
  publishedAt?: string;
  authorId?: string;
}

interface ArticleEditorProps {
  initialData?: Partial<ArticleFormData & { id: string; rejectionReason?: string; currentStatus?: string }>;
  mode: "create" | "edit";
  isAdmin?: boolean;
  agentUsers?: { id: string; name: string | null; email: string }[];
  onSave?: (data: ArticleFormData, action: "draft" | "submit" | "publish") => Promise<void>;
  backHref?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function calcReadingTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

/** Normalizes tags from the API which may be a string, JSON string, or already an array */
function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === "string") {
    // Try JSON parse first (e.g. '["cod","mobile"]')
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Fall through to comma-split
    }
    // Treat as comma-separated string
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

export function ArticleEditor({
  initialData,
  mode,
  isAdmin = false,
  agentUsers = [],
  onSave,
  backHref,
  showDeleteButton = false,
  onDelete,
}: ArticleEditorProps) {
  const router = useRouter();
  const slugCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    normalizeTags(initialData?.tags)
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? "");
  const [readingTime, setReadingTime] = useState(initialData?.readingTime ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "approved");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [authorId, setAuthorId] = useState(initialData?.authorId ?? "");

  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [loading, setLoading] = useState<"draft" | "submit" | "publish" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const isReadOnly =
    initialData?.currentStatus === "pending" ||
    (!isAdmin && initialData?.currentStatus === "approved");

  // Auto-generate slug from title (only in create mode or when slug is empty)
  useEffect(() => {
    if (mode === "create" && title && slug === "") {
      setSlug(generateSlug(title));
    }
  }, [title, mode]);

  // Debounced slug check
  useEffect(() => {
    if (!slug) { setSlugStatus("idle"); return; }
    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    setSlugStatus("checking");
    slugCheckTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ slug });
        if (initialData?.id) params.set("excludeId", initialData.id);
        const res = await fetch(`${API_BASE}/api/blog/check-slug?${params}`);
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 400);
    return () => { if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current); };
  }, [slug]);

  // Auto-calculate reading time suggestion
  useEffect(() => {
    if (content) setReadingTime(calcReadingTime(content));
  }, [content]);

  const addTag = (raw: string) => {
    const newTags = raw.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t && !tags.includes(t));
    setTags((prev) => [...prev, ...newTags]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!slug.trim()) errs.slug = "Slug is required";
    if (slugStatus === "taken") errs.slug = "Slug is already taken";
    if (!excerpt.trim()) errs.excerpt = "Excerpt is required";
    if (!content.trim()) errs.content = "Content is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAction = async (action: "draft" | "submit" | "publish") => {
    if (!validate()) return;
    setLoading(action);
    try {
      const data: ArticleFormData = {
        title, slug, content, excerpt, featuredImage, tags,
        metaTitle, metaDescription, readingTime,
        ...(isAdmin && {
          status: action === "publish" ? "approved" : action === "draft" ? "draft" : status,
          publishedAt: action === "publish" ? publishedAt : undefined,
          authorId: authorId || undefined,
        }),
        ...(!isAdmin && {
          status: action === "draft" ? "draft" : "pending",
        }),
      };
      await onSave?.(data, action);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try { await onDelete?.(); } finally { setDeleteLoading(false); setShowDeleteModal(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header bar */}
      <div className="sticky top-0 z-40 bg-[#111] border-b border-[#2a2a2a] px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => router.push(backHref ?? (isAdmin ? "/admin/articles" : "/dashboard/articles"))}
          className="flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAdmin ? "Back to All Articles" : "Back to My Articles"}
        </button>
        <div className="flex items-center gap-2">
          {showDeleteButton && !isReadOnly && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-1.5 text-sm text-red-400 border border-red-800 rounded hover:bg-red-950 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />Delete
            </button>
          )}
          {!isReadOnly && (
            <>
              {!isAdmin && (
                <button
                  onClick={() => handleAction("draft")}
                  disabled={loading !== null}
                  className="px-3 py-1.5 text-sm border border-[#2a2a2a] rounded hover:border-[#aaff00] text-[#a0a0a0] hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading === "draft" ? <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> : <Save className="w-3.5 h-3.5 inline mr-1" />}
                  Save Draft
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleAction("draft")}
                  disabled={loading !== null}
                  className="px-3 py-1.5 text-sm border border-[#2a2a2a] rounded hover:border-[#aaff00] text-[#a0a0a0] hover:text-white transition-colors disabled:opacity-50"
                >
                  {loading === "draft" ? <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> : <Save className="w-3.5 h-3.5 inline mr-1" />}
                  Save Changes
                </button>
              )}
              {!isAdmin && (
                <button
                  onClick={() => handleAction("submit")}
                  disabled={loading !== null}
                  className="px-4 py-1.5 text-sm font-semibold bg-[#aaff00] text-black rounded hover:bg-[#88cc00] transition-colors disabled:opacity-50"
                >
                  {loading === "submit" ? <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> : <Send className="w-3.5 h-3.5 inline mr-1" />}
                  Submit for Review
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleAction("publish")}
                  disabled={loading !== null}
                  className="px-4 py-1.5 text-sm font-semibold bg-[#aaff00] text-black rounded hover:bg-[#88cc00] transition-colors disabled:opacity-50"
                >
                  {loading === "publish" ? <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> : <Globe className="w-3.5 h-3.5 inline mr-1" />}
                  {mode === "create" ? "Publish Now" : "Save & Publish"}
                </button>
              )}
            </>
          )}
          {isReadOnly && initialData?.currentStatus === "approved" && (
            <a
              href={`/blog/${initialData.slug}`}
              target="_blank"
              className="px-4 py-1.5 text-sm font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />View Live
            </a>
          )}
        </div>
      </div>

      {/* Rejection banner */}
      {initialData?.rejectionReason && initialData?.currentStatus === "rejected" && (
        <div className="mx-6 mt-4 p-4 border-l-4 border-red-500 bg-red-950/30 rounded-r">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">ARTICLE REJECTED</p>
              <p className="text-red-200 text-sm mt-1">Admin feedback: &ldquo;{initialData.rejectionReason}&rdquo;</p>
              <p className="text-red-300 text-sm mt-1">Fix the issues and resubmit for review.</p>
            </div>
          </div>
        </div>
      )}

      {/* Pending lock banner */}
      {initialData?.currentStatus === "pending" && (
        <div className="mx-6 mt-4 p-4 border-l-4 border-yellow-500 bg-yellow-950/30 rounded-r">
          <p className="text-yellow-300 font-semibold">⏳ Awaiting Admin Review — Editing Locked</p>
          <p className="text-yellow-200 text-sm mt-1">This article cannot be edited while under review.</p>
        </div>
      )}

      {/* Approved banner (agent) */}
      {!isAdmin && initialData?.currentStatus === "approved" && (
        <div className="mx-6 mt-4 p-4 border-l-4 border-green-500 bg-green-950/30 rounded-r">
          <p className="text-green-300 font-semibold">✅ This article is live on the site</p>
        </div>
      )}

      <div className="flex gap-0 h-[calc(100vh-64px)]">
        {/* LEFT: Metadata */}
        <div className="w-[380px] flex-shrink-0 bg-[#111] border-r border-[#2a2a2a] overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">Title *</label>
              <span className={`text-xs ${title.length > 100 ? "text-yellow-400" : "text-[#555]"}`}>{title.length}/120</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isReadOnly}
              maxLength={120}
              placeholder="How to dominate CoD Mobile ranked..."
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">Slug *</label>
              {slugStatus === "checking" && <span className="text-xs text-[#555]">Checking…</span>}
              {slugStatus === "available" && <span className="flex items-center gap-1 text-xs text-green-400"><Check className="w-3 h-3" />Available</span>}
              {slugStatus === "taken" && <span className="flex items-center gap-1 text-xs text-red-400"><X className="w-3 h-3" />Taken</span>}
            </div>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              disabled={isReadOnly}
              placeholder="how-to-dominate-codm-ranked"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm"
            />
            {slug && (
              <p className="text-xs text-[#555] mt-1">inicioofficial.com/blog/<span className="text-[#aaff00]">{slug}</span></p>
            )}
            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">Tags</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
              }}
              onBlur={() => tagInput && addTag(tagInput)}
              disabled={isReadOnly}
              placeholder="patch-notes, weapons, guide"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-[#aaff00]/10 border border-[#aaff00]/30 text-[#aaff00] rounded text-xs">
                    {tag}
                    {!isReadOnly && <button onClick={() => removeTag(tag)} className="hover:text-white"><X className="w-2.5 h-2.5" /></button>}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">Excerpt *</label>
              <span className={`text-xs ${excerpt.length > 200 ? "text-red-400" : "text-[#555]"}`}>{excerpt.length}/200</span>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={isReadOnly}
              rows={3}
              maxLength={200}
              placeholder="Brief description for blog cards and SEO..."
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm resize-none"
            />
            {errors.excerpt && <p className="text-red-400 text-xs mt-1">{errors.excerpt}</p>}
          </div>

          {/* Featured Image */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">Featured Image URL</label>
            <input
              type="url"
              value={featuredImage}
              onChange={(e) => { setFeaturedImage(e.target.value); setImagePreviewError(false); }}
              disabled={isReadOnly}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm"
            />
            {featuredImage && !imagePreviewError && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredImage}
                alt="Preview"
                onError={() => setImagePreviewError(true)}
                className="mt-2 h-16 w-full object-cover rounded border border-[#2a2a2a]"
              />
            )}
            {imagePreviewError && <p className="text-red-400 text-xs mt-1">Invalid image URL</p>}
          </div>

          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">Meta Title</label>
              <span className={`text-xs ${metaTitle.length > 60 ? "text-red-400" : "text-[#555]"}`}>{metaTitle.length}/60</span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              disabled={isReadOnly}
              maxLength={120}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">Meta Description</label>
              <span className={`text-xs ${metaDescription.length > 160 ? "text-red-400" : "text-[#555]"}`}>{metaDescription.length}/160</span>
            </div>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              disabled={isReadOnly}
              rows={2}
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm resize-none"
            />
          </div>

          {/* Reading Time */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">Reading Time</label>
            <input
              type="text"
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              disabled={isReadOnly}
              placeholder="5 min read"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#555] focus:border-[#aaff00] focus:outline-none disabled:opacity-50 text-sm"
            />
            <p className="text-xs text-[#555] mt-1">Auto-calculated from content word count</p>
          </div>

          {/* Admin-only fields */}
          {isAdmin && (
            <>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white focus:border-[#aaff00] focus:outline-none text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved (Live)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">Published At</label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white focus:border-[#aaff00] focus:outline-none text-sm"
                />
              </div>
              {agentUsers.length > 0 && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0] mb-1 block">Author Override</label>
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white focus:border-[#aaff00] focus:outline-none text-sm"
                  >
                    <option value="">Current Admin (default)</option>
                    {agentUsers.map((u) => (
                      <option key={u.id} value={u.id}>{u.name ?? u.email}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Markdown Editor */}
        <div className="flex-1 flex flex-col overflow-hidden" data-color-mode="dark">
          {errors.content && (
            <div className="px-4 py-2 bg-red-950/50 border-b border-red-800">
              <p className="text-red-400 text-sm">{errors.content}</p>
            </div>
          )}
          {isReadOnly ? (
            <div className="flex-1 overflow-auto p-6 prose prose-invert max-w-none">
              <div className="text-[#a0a0a0] italic mb-4 text-sm">(Read-only preview)</div>
              <div className="whitespace-pre-wrap">{content || "No content."}</div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden [&_.w-md-editor]:h-full [&_.w-md-editor]:bg-[#0a0a0a] [&_.w-md-editor-toolbar]:bg-[#111] [&_.w-md-editor-toolbar]:border-b [&_.w-md-editor-toolbar]:border-[#2a2a2a] [&_.w-md-editor-content]:bg-[#0a0a0a]">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val ?? "")}
                height="100%"
                preview="live"
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-2">Delete Article?</h3>
            <p className="text-[#a0a0a0] text-sm mb-6">
              This action cannot be undone. The article <strong className="text-white">&ldquo;{initialData?.title ?? title}&rdquo;</strong> will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-[#2a2a2a] rounded text-[#a0a0a0] hover:border-white hover:text-white transition-colors"
              >Cancel</button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
