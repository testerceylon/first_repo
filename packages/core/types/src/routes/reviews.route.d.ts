import { z } from "@hono/zod-openapi";
export declare const reviewSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    userName: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
    rating: z.ZodNumber;
    status: z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
    }>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export declare const getApprovedReviews: {
    tags: string[];
    summary: string;
    path: "/";
    method: "get";
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        userId: z.ZodString;
                        userName: z.ZodNullable<z.ZodString>;
                        content: z.ZodString;
                        rating: z.ZodNumber;
                        status: z.ZodEnum<{
                            pending: "pending";
                            approved: "approved";
                            rejected: "rejected";
                        }>;
                        createdAt: z.ZodString;
                    }, z.core.$strip>>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/";
};
export declare const submitReview: {
    tags: string[];
    summary: string;
    path: "/";
    method: "post";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        content: z.ZodString;
                        rating: z.ZodNumber;
                    }, z.core.$strip>;
                };
            };
        };
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        id: z.ZodString;
                        userId: z.ZodString;
                        userName: z.ZodNullable<z.ZodString>;
                        content: z.ZodString;
                        rating: z.ZodNumber;
                        status: z.ZodEnum<{
                            pending: "pending";
                            approved: "approved";
                            rejected: "rejected";
                        }>;
                        createdAt: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/";
};
export type GetApprovedReviewsRoute = typeof getApprovedReviews;
export type SubmitReviewRoute = typeof submitReview;
