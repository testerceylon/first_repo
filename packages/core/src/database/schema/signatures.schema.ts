import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { timestamps } from "./helpers";
import { users } from "./auth.schema";

export const signatures = pgTable("signatures", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: text("type", { enum: ["draw", "type", "upload"] })
    .notNull()
    .default("draw"),
  imageUrl: text("image_url").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  usageCount: integer("usage_count").notNull().default(0),
  lastUsedAt: text("last_used_at"),
  ...timestamps,
});

export const signaturesRelations = relations(signatures, ({ one }) => ({
  user: one(users, {
    fields: [signatures.userId],
    references: [users.id],
  }),
}));
