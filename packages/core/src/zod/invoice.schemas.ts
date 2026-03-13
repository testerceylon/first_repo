import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be non-negative"),
});

export const hourlyItemSchema = z.object({
  description: z.string().min(1, "Task description is required"),
  hours: z.number().min(0.1, "Hours must be at least 0.1"),
  rate: z.number().min(0, "Hourly rate must be non-negative"),
});

export const colorThemeSchema = z.enum(["blue", "green", "purple", "orange", "red", "teal", "pink", "sky", "mint", "lavender", "coral", "amber"]).default("blue");

export const templateTypeSchema = z.enum(["standard", "hourly"]).default("standard");

export const invoiceSchema = z.object({
  // Sender info
  fromName: z.string().min(1, "Business name is required"),
  fromEmail: z.string().email("Valid email is required"),
  fromAddress: z.string().optional(),
  fromPhone: z.string().optional(),

  // Client info
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),

  // Invoice details
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().optional(),
  includeDueDate: z.boolean().default(true),
  currency: z.enum(["USD", "EUR", "GBP", "INR", "AUD", "CAD", "LKR"]).default("USD"),

  // Template & Theme (Pro features)
  templateType: templateTypeSchema,
  colorTheme: colorThemeSchema,

  // Line items
  items: z.array(lineItemSchema).min(1, "At least one item is required"),
  hourlyItems: z.array(hourlyItemSchema).optional().default([]),

  // Extras
  taxPercent: z.number().min(0).max(100).default(0),
  discountPercent: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});

export const invoiceCreateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;
export type HourlyItem = z.infer<typeof hourlyItemSchema>;
export type ColorTheme = z.infer<typeof colorThemeSchema>;
export type TemplateType = z.infer<typeof templateTypeSchema>;
export type InvoiceCreateResponse = z.infer<typeof invoiceCreateResponseSchema>;
