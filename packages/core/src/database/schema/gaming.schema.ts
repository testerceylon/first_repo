import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const youtubeCache = pgTable("youtube_cache", {
  id: text("id").primaryKey(),         // YouTube video ID
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  published_at: timestamp("published_at").notNull(),
  view_count: text("view_count"),
  playlist_id: text("playlist_id"),
  fetched_at: timestamp("fetched_at").defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  source: text("source").default("website"), // website, tournament, community
  created_at: timestamp("created_at").defaultNow(),
});
