import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";

export const invoiceDownloads = pgTable("invoice_downloads", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  invoiceNumber: text("invoice_number").notNull(),
  clientName: text("client_name").notNull(),
  totalAmount: text("total_amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoiceDownloadsRelations = relations(invoiceDownloads, ({ one }) => ({
  user: one(users, {
    fields: [invoiceDownloads.userId],
    references: [users.id],
  }),
}));
