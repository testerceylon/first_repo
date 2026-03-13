import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./auth.schema";
import { timestamps } from "./helpers";

export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // Markdown content
  excerpt: text("excerpt").notNull(), // Short preview for SEO
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status", {
    enum: ["draft", "pending", "approved", "rejected"],
  })
    .notNull()
    .default("draft"),
  featuredImage: text("featured_image"), // Optional cover image URL
  metaTitle: text("meta_title"), // SEO: Custom meta title
  metaDescription: text("meta_description"), // SEO: Custom meta description
  tags: text("tags"), // Comma-separated tags for categorization
  readingTime: text("reading_time"), // Estimated reading time (e.g., "5 min read")
  views: text("views").default("0"), // Track article views
  rejectionReason: text("rejection_reason"), // Admin feedback on rejection
  approvedAt: timestamp("approved_at"), // When admin approved
  approvedBy: text("approved_by").references(() => users.id), // Which admin approved
  publishedAt: timestamp("published_at"), // When article went live
  ...timestamps,
});

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [blogPosts.approvedBy],
    references: [users.id],
  }),
}));
