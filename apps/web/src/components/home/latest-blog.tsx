import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string | null;
  readingTime: string | null;
  publishedAt: string | null;
  featuredImage: string | null;
  author: { name: string } | null;
}

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/blog/public`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.posts ?? []).slice(0, 3);
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

export async function LatestBlogSection() {
  const posts = await getLatestPosts();

  return (
    <section className="py-20 px-4 bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="badge mb-2">Latest Articles</span>
            <h2 className="section-title">FROM THE BLOG</h2>
          </div>
          <Link
            href="/blog"
            className="font-heading text-sm font-bold uppercase text-[#aaff00] hover:text-white transition-colors tracking-wider"
          >
            View All →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-center py-16 text-[#444] font-body">
            No articles yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <span className="badge text-xs mb-3 block w-fit">
                      {post.tags.split(",")[0].trim()}
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#aaff00] transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-[#666] line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#444]">
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
  );
}
