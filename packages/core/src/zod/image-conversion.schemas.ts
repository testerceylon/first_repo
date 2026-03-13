import { z } from "zod";

export const insertImageConversionSchema = z.object({
  file_name: z.string().max(255).default("image"),
  from_format: z.string().max(10),
  to_format: z.string().max(10),
});

export const imageConversionCreateResponseSchema = z.object({
  success: z.boolean(),
  credits_remaining: z.number(),
});

export const imageConversionUsageSchema = z.object({
  total: z.number(),
  limit: z.number(),
  remaining: z.number(),
  isPro: z.boolean(),
});

export type InsertImageConversionT = z.infer<typeof insertImageConversionSchema>;
export type ImageConversionCreateResponseT = z.infer<typeof imageConversionCreateResponseSchema>;
export type ImageConversionUsageT = z.infer<typeof imageConversionUsageSchema>;
