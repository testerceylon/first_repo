import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { getApprovedReviews, submitReview } from "core/database/queries";
import type { APIRouteHandler } from "@/types";
import type { GetApprovedReviewsRoute, SubmitReviewRoute } from "@/routes/reviews.route";

export const getApproved: APIRouteHandler<GetApprovedReviewsRoute> = async (c) => {
    try {
        const db = c.get("db");
        const result = await getApprovedReviews(db);

        // Normalize format for the route schema
        const normalized = result.map((r: any) => ({
            ...r,
            createdAt: r.createdAt.toISOString()
        }));

        return c.json(normalized, HttpStatusCodes.OK);
    } catch (error) {
        return c.json(
            { message: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR } as any,
            HttpStatusCodes.INTERNAL_SERVER_ERROR as any,
        );
    }
};

export const submit: APIRouteHandler<SubmitReviewRoute> = async (c) => {
    try {
        const user = c.get("user");
        if (!user) {
            return c.json({ message: HttpStatusPhrases.UNAUTHORIZED } as any, HttpStatusCodes.UNAUTHORIZED as any);
        }

        const db = c.get("db");
        const body = c.req.valid("json");

        const result = await submitReview(db, user.id, body);

        return c.json(result, HttpStatusCodes.OK);
    } catch (error) {
        return c.json(
            { message: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR } as any,
            HttpStatusCodes.INTERNAL_SERVER_ERROR as any,
        );
    }
};
