import { z } from "zod";

export const tiktokRequestSchema = z.object({
  url: z.string().min(1, "Please enter a TikTok URL"),
});

export const tiktokResponseSchema = z.object({
  thumbnailUrl: z.string(),
  title: z.string(),
  authorName: z.string(),
  authorUrl: z.string(),
  thumbnailWidth: z.number(),
  thumbnailHeight: z.number(),
});

export const tiktokDownloadQuerySchema = z.object({
  url: z.string().min(1),
});

export const tiktokStatsResponseSchema = z.object({
  count: z.number(),
});

export type TikTokRequest = z.infer<typeof tiktokRequestSchema>;
export type TikTokResponse = z.infer<typeof tiktokResponseSchema>;
export type TikTokDownloadQuery = z.infer<typeof tiktokDownloadQuerySchema>;
