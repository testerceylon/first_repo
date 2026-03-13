import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./auth.schema";

export const pdfCompressions = pgTable("pdf_compressions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull().default("document"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pdfCompressionsRelations = relations(pdfCompressions, ({ one }) => ({
  user: one(users, {
    fields: [pdfCompressions.userId],
    references: [users.id],
  }),
}));
