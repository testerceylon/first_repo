import * as HttpStatusCodes from "stoker/http-status-codes";
import { getDatabase } from "core/database";
import { youtubeCache } from "core/database/schema";
import { eq, desc } from "drizzle-orm";
import type { GetLatestVideosRoute } from "@/routes/youtube.route";
import type { APIRouteHandler } from "@/types";

const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

interface YouTubeApiItem {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { maxres?: { url: string }; high?: { url: string }; medium?: { url: string } };
    publishedAt: string;
    playlistId?: string;
  };
  statistics?: { viewCount?: string };
}

async function fetchFromYouTubeAPI(limit: number): Promise<YouTubeApiItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    throw new Error("Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID env vars");
  }

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("key", apiKey);
  searchUrl.searchParams.set("channelId", channelId);
  searchUrl.searchParams.set("order", "date");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("maxResults", String(Math.min(limit, 50)));

  const searchRes = await fetch(searchUrl.toString());
  if (!searchRes.ok) {
    const err = await searchRes.text();
    throw new Error(`YouTube API error: ${err}`);
  }

  const searchData = await searchRes.json() as { items?: YouTubeApiItem[] };
  const items: YouTubeApiItem[] = searchData.items ?? [];

  // Fetch view counts via videos.list
  const videoIds = items.map((i: YouTubeApiItem) => i.id.videoId).join(",");
  if (!videoIds) return items;

  const statsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  statsUrl.searchParams.set("key", apiKey);
  statsUrl.searchParams.set("id", videoIds);
  statsUrl.searchParams.set("part", "statistics");

  const statsRes = await fetch(statsUrl.toString());
  if (statsRes.ok) {
    const statsData = await statsRes.json() as { items?: { id: string; statistics: { viewCount?: string } }[] };
    const statsMap = new Map<string, { viewCount?: string }>(
      (statsData.items ?? []).map((s) => [s.id, s.statistics])
    );
    items.forEach((item) => {
      item.statistics = statsMap.get(item.id.videoId) ?? {};
    });
  }

  return items;
}

export const getLatestVideos: APIRouteHandler<GetLatestVideosRoute> = async (c) => {
  const db = getDatabase();
  const { limit = "12" } = c.req.valid("query");
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

  try {
    // Check cache first
    const twoHoursAgo = new Date(Date.now() - CACHE_TTL_MS);
    const cached = await db
      .select()
      .from(youtubeCache)
      .orderBy(desc(youtubeCache.published_at))
      .limit(limitNum);

    const freshCached = cached.filter(
      (v) => v.fetched_at && v.fetched_at > twoHoursAgo
    );

    if (freshCached.length >= limitNum) {
      return c.json(
        freshCached.map((v) => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          publishedAt: v.published_at.toISOString(),
          viewCount: v.view_count,
          url: `https://www.youtube.com/watch?v=${v.id}`,
        })),
        HttpStatusCodes.OK
      );
    }

    // Fetch from YouTube API
    const items = await fetchFromYouTubeAPI(limitNum);

    // Upsert into cache
    const now = new Date();
    for (const item of items) {
      const videoId = item.id.videoId;
      const thumbnail =
        item.snippet.thumbnails.maxres?.url ??
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        "";

      await db
        .insert(youtubeCache)
        .values({
          id: videoId,
          title: item.snippet.title,
          thumbnail,
          published_at: new Date(item.snippet.publishedAt),
          view_count: item.statistics?.viewCount ?? null,
          playlist_id: item.snippet.playlistId ?? null,
          fetched_at: now,
        })
        .onConflictDoUpdate({
          target: youtubeCache.id,
          set: {
            title: item.snippet.title,
            thumbnail,
            view_count: item.statistics?.viewCount ?? null,
            fetched_at: now,
          },
        });
    }

    const result = items.slice(0, limitNum).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ??
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        "",
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount ?? null,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return c.json(result, HttpStatusCodes.OK);
  } catch (err) {
    console.error("[YouTube] Failed to fetch videos:", err);

    // Fallback: return whatever is in cache even if stale
    const stale = await db
      .select()
      .from(youtubeCache)
      .orderBy(desc(youtubeCache.published_at))
      .limit(limitNum);

    if (stale.length > 0) {
      return c.json(
        stale.map((v) => ({
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          publishedAt: v.published_at.toISOString(),
          viewCount: v.view_count,
          url: `https://www.youtube.com/watch?v=${v.id}`,
        })),
        HttpStatusCodes.OK
      );
    }

    return c.json({ message: "Failed to fetch videos" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};
