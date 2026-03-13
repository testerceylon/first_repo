"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Youtube, Eye, Clock } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  url: string;
}

function formatViews(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function VideoSkeleton() {
  return (
    <div className="card-gaming animate-pulse">
      <div className="aspect-video bg-[#1a1a1a] rounded-t-xl" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-[#1a1a1a] rounded w-full" />
        <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
        <div className="h-3 bg-[#1a1a1a] rounded w-1/2 mt-3" />
      </div>
    </div>
  );
}

export function LatestVideosSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  useEffect(() => {
    fetch(`${apiUrl}/api/youtube/latest?limit=3`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setVideos(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [apiUrl]);

  return (
    <section className="py-20 px-4 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="badge mb-2">Latest Videos</span>
            <h2 className="section-title">FROM THE CHANNEL</h2>
          </div>
          <Link
            href="/videos"
            className="font-heading text-sm font-bold uppercase text-[#aaff00] hover:text-white transition-colors tracking-wider"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <VideoSkeleton key={i} />)
            : videos.length === 0
            ? (
                <div className="col-span-3 text-center py-16 text-[#444] font-body">
                  No videos found. Check your YouTube API configuration.
                </div>
              )
            : videos.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-gaming group block overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#111]">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <div className="w-14 h-14 rounded-full bg-[#ff0000] flex items-center justify-center">
                        <Youtube className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-body font-semibold text-white text-sm leading-snug line-clamp-2 mb-3 group-hover:text-[#aaff00] transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-[#555]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatViews(video.viewCount)} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(video.publishedAt)}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
