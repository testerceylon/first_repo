import { z } from "zod";

export const thumbnailRequestSchema = z.object({
  url: z.string().url("Please enter a valid YouTube URL"),
});

export const thumbnailResolutionSchema = z.enum([
  "maxres",  // 1280x720
  "hq",      // 480x360
  "sd",      // 640x480
  "mq",      // 320x180
  "default", // 120x90
]);

export const thumbnailInfoSchema = z.object({
  resolution: thumbnailResolutionSchema,
  url: z.string().url(),
  width: z.number(),
  height: z.number(),
  label: z.string(),
  available: z.boolean(),
});

export const thumbnailResponseSchema = z.object({
  videoId: z.string(),
  title: z.string().optional(),
  thumbnails: z.array(thumbnailInfoSchema),
});

export const thumbnailDownloadQuerySchema = z.object({
  url: z.string(),
});

export type ThumbnailRequest = z.infer<typeof thumbnailRequestSchema>;
export type ThumbnailResolution = z.infer<typeof thumbnailResolutionSchema>;
export type ThumbnailInfo = z.infer<typeof thumbnailInfoSchema>;
export type ThumbnailResponse = z.infer<typeof thumbnailResponseSchema>;
export type ThumbnailDownloadQuery = z.infer<typeof thumbnailDownloadQuerySchema>;
