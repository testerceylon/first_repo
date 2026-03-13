import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { timestamps } from "./helpers";
import { users } from "./auth.schema";

export const thumbnailDownloads = pgTable("thumbnail_downloads", {
  id: text("id").primaryKey(),
  videoId: text("video_id").notNull(),
  resolution: text("resolution").notNull(), // 'maxres', 'hq', 'mq', 'sd', 'default'
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }), // nullable for anonymous users
  ...timestamps,
});

export const thumbnailDownloadsRelations = relations(thumbnailDownloads, ({ one }) => ({
  user: one(users, {
    fields: [thumbnailDownloads.userId],
    references: [users.id],
  }),
}));
