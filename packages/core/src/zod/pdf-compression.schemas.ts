import { z } from "zod";

export const insertPdfCompressionSchema = z.object({
  file_name: z.string().max(255).default("document"),
});

export const pdfCompressionCreateResponseSchema = z.object({
  success: z.boolean(),
  credits_remaining: z.number(),
});

export const pdfCompressionUsageSchema = z.object({
  total: z.number(),
  limit: z.number(),
  remaining: z.number(),
  isPro: z.boolean(),
});

export type InsertPdfCompressionT = z.infer<typeof insertPdfCompressionSchema>;
export type PdfCompressionCreateResponseT = z.infer<typeof pdfCompressionCreateResponseSchema>;
export type PdfCompressionUsageT = z.infer<typeof pdfCompressionUsageSchema>;
