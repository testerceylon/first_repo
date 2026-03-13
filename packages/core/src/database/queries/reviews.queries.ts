import { and, eq, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { Database } from "../index";
import { reviews, users } from "../schema";

export async function getApprovedReviews(db: Database) {
    return db
        .select({
            id: reviews.id,
            userId: reviews.userId,
            userName: users.name,
            content: reviews.content,
            rating: reviews.rating,
            status: reviews.status,
            createdAt: reviews.createdAt,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.status, "approved"))
        .orderBy(desc(reviews.createdAt));
}

export async function submitReview(db: Database, userId: string, data: { content: string; rating: number }) {
    const id = randomUUID();
    const [created] = await db
        .insert(reviews)
        .values({
            id,
            userId,
            content: data.content,
            rating: data.rating,
            status: "pending",
        })
        .returning();

    if (!created) {
        throw new Error("Failed to submit review");
    }

    // Fetch the user name to return complete object
    const user = await db.select({ name: users.name }).from(users).where(eq(users.id, userId)).limit(1);

    return {
        ...created,
        userName: user[0]?.name ?? null,
        createdAt: created.createdAt.toISOString(),
    };
}

export async function getAllReviewsAdmin(db: Database) {
    return db
        .select({
            id: reviews.id,
            userId: reviews.userId,
            userName: users.name,
            userEmail: users.email,
            content: reviews.content,
            rating: reviews.rating,
            status: reviews.status,
            createdAt: reviews.createdAt,
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.userId, users.id))
        .orderBy(desc(reviews.createdAt));
}

export async function updateReviewStatus(db: Database, id: string, status: "approved" | "rejected") {
    const [updated] = await db
        .update(reviews)
        .set({ status, updatedAt: new Date() })
        .where(eq(reviews.id, id))
        .returning();

    if (!updated) {
        return null;
    }

    const user = await db.select({ name: users.name }).from(users).where(eq(users.id, updated.userId)).limit(1);

    return {
        ...updated,
        userName: user[0]?.name ?? null,
        createdAt: updated.createdAt.toISOString(),
    };
}
