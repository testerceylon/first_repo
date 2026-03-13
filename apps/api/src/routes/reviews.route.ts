import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorMessageSchema } from "core/zod";
import { authMiddleware } from "@/middlewares/auth.middleware";

const tags = ["Reviews"];

export const reviewSchema = z.object({
    id: z.string(),
    userId: z.string(),
    userName: z.string().nullable(),
    content: z.string(),
    rating: z.number(),
    status: z.enum(["pending", "approved", "rejected"]),
    createdAt: z.string(),
});

export const getApprovedReviews = createRoute({
    tags,
    summary: "Get all approved reviews",
    path: "/",
    method: "get",
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.array(reviewSchema),
            "List of approved reviews"
        ),
    },
});

export const submitReview = createRoute({
    tags,
    summary: "Submit a new review",
    path: "/",
    method: "post",
    middleware: [authMiddleware],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        content: z.string().min(1),
                        rating: z.number().min(1).max(5),
                    }),
                },
            },
        },
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(reviewSchema, "Submitted review"),
        [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    },
});

export type GetApprovedReviewsRoute = typeof getApprovedReviews;
export type SubmitReviewRoute = typeof submitReview;
