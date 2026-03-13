import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Inicio Official",
  description: "CoD Mobile guides, tips, tier lists, and community news from Inicio Official.",
  openGraph: {
    title: "Blog | Inicio Official",
    description: "CoD Mobile guides, tips, tier lists, and community news.",
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: { name: string };
  publishedAt: string | null;
  readingTime: string | null;
  featuredImage: string | null;
  tags: string | null;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/blog/public`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="py-20 px-4 bg-[#0d0d0d] border-b border-[#1a1a1a] text-center">
        <span className="badge mb-3">Articles</span>
        <h1 className="section-title mx-auto mb-4">THE BLOG</h1>
        <p className="font-body text-[#666] max-w-xl mx-auto">
          CoD Mobile guides, weapon tier lists, gameplay tips, and community news.
        </p>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <h2 className="font-heading font-bold text-2xl text-white mb-2">No articles yet</h2>
              <p className="font-body text-[#555]">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="card-gaming group block overflow-hidden"
                >
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden bg-[#111]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {post.tags && (
                      <div className="flex gap-2 flex-wrap mb-2">
                        {post.tags.split(",").slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="badge text-xs">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-heading font-bold text-white text-lg leading-snug mb-2 line-clamp-2 group-hover:text-[#aaff00] transition-colors">
                      {post.title}
                    </h2>
                    <p className="font-body text-sm text-[#666] line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#444]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author.name}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                      {post.readingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
