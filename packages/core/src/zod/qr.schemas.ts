import { z } from "zod";

const hexColorPattern = /^#?[0-9a-fA-F]{6}$/;

export const insertQrCodeSchema = z.object({
  url: z.string().url().min(1).max(2048),
  color: z.string().regex(hexColorPattern, "Color must be a 6-digit hex value"),
  backgroundColor: z
    .string()
    .regex(hexColorPattern, "Background must be a 6-digit hex value"),
  size: z.number().int().min(4).max(64).default(10),
});

export const selectQrCodeSchema = insertQrCodeSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const qrUsageSchema = z.object({
  total: z.number(),
  limit: z.number(),
  remaining: z.number(),
  isPro: z.boolean(),
});

export const qrCreateResponseSchema = z.object({
  code: selectQrCodeSchema,
  meta: qrUsageSchema,
});

export type InsertQrCodeT = z.infer<typeof insertQrCodeSchema>;
export type SelectQrCodeT = z.infer<typeof selectQrCodeSchema>;
export type QrUsageT = z.infer<typeof qrUsageSchema>;
export type QrCreateResponseT = z.infer<typeof qrCreateResponseSchema>;
