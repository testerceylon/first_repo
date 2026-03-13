import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "./helpers";
import { users } from "./auth.schema";

export const tiktokDownloads = pgTable("tiktok_downloads", {
  id: text("id").primaryKey(),
  videoUrl: text("video_url").notNull(),
  authorName: text("author_name"),
  title: text("title"),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
});

export const tiktokDownloadsRelations = relations(tiktokDownloads, ({ one }) => ({
  user: one(users, {
    fields: [tiktokDownloads.userId],
    references: [users.id],
  }),
}));
