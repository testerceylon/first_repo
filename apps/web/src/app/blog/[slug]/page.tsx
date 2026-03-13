import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: { name: string };
  publishedAt: string | null;
  readingTime: string | null;
  featuredImage: string | null;
  tags: string | null;
  views: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/blog/public/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.post ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) return { title: "Article Not Found | Inicio Official" };

  return {
    title: `${post.metaTitle ?? post.title} | Inicio Official`,
    description: post.metaDescription ?? post.excerpt,
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Back bar */}
      <div className="bg-[#0d0d0d] border-b border-[#1a1a1a]">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-body text-sm text-[#555] hover:text-[#aaff00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Tags */}
        {post.tags && (
          <div className="flex gap-2 flex-wrap mb-6">
            {post.tags.split(",").map((tag, idx) => (
              <span key={idx} className="badge">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading font-bold text-white leading-tight mb-6"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-[#555] mb-8 pb-8 border-b border-[#1a1a1a]">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {post.author.name}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {post.views} views
          </span>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-10 rounded-xl overflow-hidden border border-[#1a1a1a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        {/* <!-- Adsense slot: top-of-article --> */}
        <div className="prose max-w-none
          prose-headings:font-heading prose-headings:text-white prose-headings:font-bold
          prose-p:text-[#aaa] prose-p:leading-relaxed prose-p:font-body
          prose-a:text-[#aaff00] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-ul:text-[#aaa] prose-ol:text-[#aaa]
          prose-li:marker:text-[#aaff00]
          prose-blockquote:border-l-[#aaff00] prose-blockquote:text-[#666]
          prose-code:text-[#aaff00] prose-code:bg-[#111] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-[#111] prose-pre:border prose-pre:border-[#1e1e1e]
          prose-hr:border-[#1a1a1a]
          prose-img:rounded-xl prose-img:border prose-img:border-[#1a1a1a]">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        {/* <!-- Adsense slot: end-of-article --> */}
      </article>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#0d0d0d] border-t border-[#1a1a1a] text-center">
        <h2 className="font-heading font-bold text-2xl text-white uppercase mb-2">
          Want more <span className="neon-text">CoD Mobile</span> content?
        </h2>
        <p className="font-body text-[#555] max-w-md mx-auto mb-6">
          Subscribe for weekly videos, guides, and tier lists.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.youtube.com/@inicioofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-youtube"
          >
            Subscribe on YouTube
          </a>
          <Link href="/community" className="btn-outline">
            Join Community
          </Link>
        </div>
      </section>
    </main>
  );
}
