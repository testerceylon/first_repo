import { z } from "zod";

export const insertCropDownloadSchema = z.object({
  fileName: z.string().max(255).default("image"),
});

export const cropUsageSchema = z.object({
  total: z.number(),
  limit: z.number(),
  remaining: z.number(),
  isPro: z.boolean(),
});

export const cropCreateResponseSchema = z.object({
  id: z.string(),
  meta: cropUsageSchema,
});

export type InsertCropDownloadT = z.infer<typeof insertCropDownloadSchema>;
export type CropUsageT = z.infer<typeof cropUsageSchema>;
export type CropCreateResponseT = z.infer<typeof cropCreateResponseSchema>;
