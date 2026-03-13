import { z } from "zod";

// ---------- Signature type ----------
export const signatureTypeSchema = z.enum(["draw", "type", "upload"]);
export type SignatureType = z.infer<typeof signatureTypeSchema>;

// ---------- Select schema ----------
export const selectSignatureSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  type: signatureTypeSchema,
  imageUrl: z.string(),
  isDefault: z.boolean(),
  usageCount: z.number(),
  lastUsedAt: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

// ---------- Insert schema ----------
// Max base64 image size: ~500 KB encoded
const MAX_IMAGE_BYTES = 700_000;

export const insertSignatureSchema = z.object({
  name: z.string().min(1, "Name is required").max(128, "Name too long"),
  type: signatureTypeSchema,
  imageUrl: z
    .string()
    .min(1, "Image is required")
    .max(MAX_IMAGE_BYTES, "Image too large (max 500 KB)"),
});

// ---------- Update schema ----------
export const updateSignatureDefaultSchema = z.object({
  isDefault: z.boolean(),
});

// ---------- PDF embed schema (PRO) ----------
export const pdfEmbedSchema = z.object({
  /** Base64-encoded PDF */
  pdfBase64: z.string().min(1).max(5_000_000, "PDF too large (max 3.5 MB)"),
  /** Signature image base64 */
  signatureBase64: z.string().min(1).max(MAX_IMAGE_BYTES),
  /** Page number (1-indexed) */
  page: z.number().int().min(1).default(1),
  /** Position as percentage of page dimensions */
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  width: z.number().min(1).max(100).default(20),
  height: z.number().min(1).max(100).default(10),
});

// ---------- Response schemas ----------
export const signatureListResponseSchema = z.object({
  data: z.array(selectSignatureSchema),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    remaining: z.number(),
    isPro: z.boolean(),
    canDelete: z.boolean(),
  }),
});

// ---------- Type exports ----------
export type SelectSignatureT = z.infer<typeof selectSignatureSchema>;
export type InsertSignatureT = z.infer<typeof insertSignatureSchema>;
export type UpdateSignatureDefaultT = z.infer<
  typeof updateSignatureDefaultSchema
>;
export type PdfEmbedT = z.infer<typeof pdfEmbedSchema>;
export type SignatureListResponseT = z.infer<typeof signatureListResponseSchema>;
