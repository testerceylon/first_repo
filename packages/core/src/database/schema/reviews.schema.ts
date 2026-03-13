import { pgTable, text, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth.schema";
import { timestamps } from "./helpers";

export const reviews = pgTable(
    "reviews",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        content: text("content").notNull(),
        rating: integer("rating").notNull().default(5),
        status: text("status", { enum: ["pending", "approved", "rejected"] })
            .default("pending")
            .notNull(),
        ...timestamps,
    },
    (table) => [index("reviews_userId_idx").on(table.userId)]
);

export const reviewRelations = relations(reviews, ({ one }) => ({
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
}));
