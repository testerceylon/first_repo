"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus, FileText, Edit, Eye, Send, Clock, CheckCircle, XCircle,
  Youtube, Users, Crosshair, Layers, TrendingUp, ArrowRight,
  ShieldCheck, Calendar, Loader2, UserIcon, LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
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

function memberSince(date: Date | string): string {
  return new Date(date).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace("/signin?redirect=/dashboard");
    }
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!session?.user) return;
    fetch(`${API_BASE}/api/blog/mine`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch(() => {})
      .finally(() => setPostsLoading(false));
  }, [session?.user]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#aaff00]" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;

  // Stats derived from posts
  const stats = {
    total: posts.length,
    draft: posts.filter((p) => p.status === "draft").length,
    pending: posts.filter((p) => p.status === "pending").length,
    approved: posts.filter((p) => p.status === "approved").length,
    rejected: posts.filter((p) => p.status === "rejected").length,
  };

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[Rajdhani]">
            WELCOME BACK, <span className="text-[#aaff00]">{user.name?.split(" ")[0]?.toUpperCase() ?? "AGENT"}</span>
          </h1>
          <p className="text-[#555] text-sm">Your Inicio Official agent dashboard</p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#aaff00] text-black font-bold rounded hover:bg-[#88cc00] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-8">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Articles", value: stats.total, color: "#aaff00", icon: FileText },
              { label: "Drafts", value: stats.draft, color: "#a0a0a0", icon: Edit },
              { label: "Under Review", value: stats.pending, color: "#fbbf24", icon: Clock },
              { label: "Live", value: stats.approved, color: "#4ade80", icon: CheckCircle },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#555] uppercase tracking-wider">{label}</span>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-3xl font-bold font-[Rajdhani]" style={{ color }}>
                  {postsLoading ? "—" : value}
                </p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#555] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/dashboard/articles/new"
                className="flex items-center gap-3 p-4 bg-[#111] border border-[#aaff00]/20 rounded-xl hover:border-[#aaff00]/60 hover:bg-[#111] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#aaff00]/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-[#aaff00]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Write Article</p>
                  <p className="text-[#555] text-xs">Create new content</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#333] group-hover:text-[#aaff00] ml-auto transition-colors" />
              </Link>

              <Link
                href="/dashboard/articles"
                className="flex items-center gap-3 p-4 bg-[#111] border border-[#1a1a1a] rounded-xl hover:border-[#2a2a2a] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#a0a0a0]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">My Articles</p>
                  <p className="text-[#555] text-xs">Manage all your posts</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#333] group-hover:text-white ml-auto transition-colors" />
              </Link>

              <Link
                href="/blog"
                className="flex items-center gap-3 p-4 bg-[#111] border border-[#1a1a1a] rounded-xl hover:border-[#2a2a2a] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-[#a0a0a0]" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Browse Blog</p>
                  <p className="text-[#555] text-xs">See published articles</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#333] group-hover:text-white ml-auto transition-colors" />
              </Link>
            </div>
          </div>

          {/* Recent articles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#555]">Recent Articles</h2>
              <Link href="/dashboard/articles" className="text-xs text-[#a0a0a0] hover:text-[#aaff00] transition-colors flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {postsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#aaff00]" />
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="bg-[#111] border border-dashed border-[#2a2a2a] rounded-xl p-10 text-center">
                <FileText className="w-10 h-10 text-[#2a2a2a] mx-auto mb-3" />
                <p className="text-[#a0a0a0] font-semibold">No articles yet</p>
                <p className="text-[#555] text-sm mt-1 mb-4">Share your CoD knowledge with the community</p>
                <Link
                  href="/dashboard/articles/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#aaff00] text-black font-bold rounded text-sm hover:bg-[#88cc00] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Write your first article
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentPosts.map((post) => (
                  <div key={post.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3 flex items-center gap-4 hover:border-[#2a2a2a] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{post.title}</p>
                      {post.status === "rejected" && post.rejectionReason && (
                        <p className="text-red-400 text-xs mt-0.5 truncate">↳ {post.rejectionReason}</p>
                      )}
                      <p className="text-[#555] text-xs mt-0.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 border rounded font-medium ${STATUS_COLORS[post.status] ?? ""}`}>
                      {STATUS_LABELS[post.status] ?? post.status}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {post.status === "draft" && (
                        <>
                          <Link href={`/dashboard/articles/${post.id}/edit`} className="p-1.5 text-[#555] hover:text-white rounded transition-colors" title="Edit">
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </>
                      )}
                      {post.status === "pending" && (
                        <Link href={`/dashboard/articles/${post.id}/preview`} className="p-1.5 text-[#555] hover:text-white rounded transition-colors" title="Preview">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {post.status === "approved" && (
                        <Link href={`/blog/${post.slug}`} className="p-1.5 text-green-500 hover:text-green-400 rounded transition-colors" title="View Live">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {post.status === "rejected" && (
                        <Link href={`/dashboard/articles/${post.id}/edit`} className="p-1.5 text-[#aaff00] hover:text-[#88cc00] rounded transition-colors" title="Edit & Resubmit">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workflow guide */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#555] mb-4">Article Workflow</h2>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              {[
                { label: "Write", color: "#aaff00", icon: Edit },
                { label: "Save Draft", color: "#a0a0a0", icon: FileText },
                { label: "Submit for Review", color: "#fbbf24", icon: Send },
                { label: "Admin Reviews", color: "#a0a0a0", icon: Clock },
                { label: "Live on Blog", color: "#4ade80", icon: CheckCircle },
              ].map(({ label, color, icon: Icon }, i, arr) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <span style={{ color }} className="font-medium">{label}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-[#333]">→</span>}
                </div>
              ))}
            </div>
            <p className="text-[#555] text-xs mt-3">
              If rejected, the admin will give you a reason. Edit your article and resubmit.
            </p>
          </div>

          {/* Tools teaser */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#555] mb-4">Gaming Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/tools/sensitivity", icon: Crosshair, label: "Sensitivity Calc", color: "#aaff00" },
                { href: "/tools/loadout", icon: Layers, label: "Loadout Builder", color: "#ff2d2d" },
                { href: "/tools/kd-calculator", icon: TrendingUp, label: "K/D Calculator", color: "#00aaff" },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-4 bg-[#111] border border-[#1a1a1a] rounded-xl hover:border-[#2a2a2a] transition-all group"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color }} />
                  <span className="text-sm font-medium">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#333] group-hover:text-white ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — Profile sidebar ── */}
        <div className="space-y-5">
          {/* Profile card */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-5">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name ?? ""} className="w-12 h-12 rounded-full border-2 border-[#aaff00]/30 object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-[#555]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-white truncate">{user.name ?? "Unknown"}</p>
                <p className="text-[#555] text-xs truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#555]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Role</span>
                </div>
                <span className="px-2 py-0.5 bg-[#aaff00]/10 border border-[#aaff00]/20 text-[#aaff00] rounded text-xs font-bold uppercase">
                  {(user as { role?: string }).role ?? "agent"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#555]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member Since</span>
                </div>
                <span className="text-[#a0a0a0] text-xs">{memberSince(user.createdAt)}</span>
              </div>
              {!postsLoading && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#555]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Articles</span>
                  </div>
                  <span className="text-[#a0a0a0] text-xs">{stats.total} total · {stats.approved} live</span>
                </div>
              )}
            </div>
          </div>

          {/* Pending/rejected alerts */}
          {!postsLoading && stats.pending > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 font-semibold text-sm">{stats.pending} Under Review</span>
              </div>
              <p className="text-yellow-600 text-xs">Your articles are being reviewed by our team.</p>
            </div>
          )}
          {!postsLoading && stats.rejected > 0 && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 font-semibold text-sm">{stats.rejected} Need Revision</span>
              </div>
              <p className="text-red-600 text-xs mb-2">Admin left feedback on your articles.</p>
              <Link href="/dashboard/articles?tab=rejected" className="text-xs text-red-400 hover:text-red-300 underline">
                View & fix →
              </Link>
            </div>
          )}

          {/* Community links */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#555] mb-4">Community</h3>
            <div className="space-y-2">
              <a
                href="https://www.youtube.com/@inicioofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors group"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="text-sm flex-1">YouTube</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#333] group-hover:text-white transition-colors" />
              </a>
              <Link
                href="/community"
                className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors group"
              >
                <Users className="w-4 h-4 text-[#5865F2]" />
                <span className="text-sm flex-1">Community</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#333] group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#2a2a2a] rounded-xl text-[#555] hover:text-red-400 hover:border-red-900 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
