import { z } from "zod";

export const insertBgRemovalSchema = z.object({
  fileName: z.string().max(255).default("image"),
});

export const bgRemovalUsageSchema = z.object({
  total: z.number(),
  limit: z.number(),
  remaining: z.number(),
  isPro: z.boolean(),
});

export const bgRemovalCreateResponseSchema = z.object({
  id: z.string(),
  meta: bgRemovalUsageSchema,
});

export type InsertBgRemovalT = z.infer<typeof insertBgRemovalSchema>;
export type BgRemovalUsageT = z.infer<typeof bgRemovalUsageSchema>;
export type BgRemovalCreateResponseT = z.infer<typeof bgRemovalCreateResponseSchema>;
