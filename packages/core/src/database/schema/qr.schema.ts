import { relations } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./helpers";
import { users } from "./auth.schema";

export const qrCodes = pgTable("qr_codes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  color: varchar("color", { length: 16 }).notNull().default("#000000"),
  backgroundColor: varchar("background_color", { length: 16 })
    .notNull()
    .default("#ffffff"),
  size: integer("size").notNull().default(10),
  ...timestamps,
});

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  user: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
  }),
}));
