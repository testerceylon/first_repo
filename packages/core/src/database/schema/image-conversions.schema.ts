import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./auth.schema";

export const imageConversions = pgTable("image_conversions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull().default("image"),
  fromFormat: text("from_format").notNull(),
  toFormat: text("to_format").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const imageConversionsRelations = relations(imageConversions, ({ one }) => ({
  user: one(users, {
    fields: [imageConversions.userId],
    references: [users.id],
  }),
}));
