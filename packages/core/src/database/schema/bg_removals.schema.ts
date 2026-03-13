import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./auth.schema";

export const bgRemovals = pgTable("bg_removals", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull().default("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bgRemovalsRelations = relations(bgRemovals, ({ one }) => ({
  user: one(users, {
    fields: [bgRemovals.userId],
    references: [users.id],
  }),
}));
