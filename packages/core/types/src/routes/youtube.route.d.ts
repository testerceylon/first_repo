import { z } from "@hono/zod-openapi";
export declare const getLatestVideos: {
    tags: string[];
    summary: string;
    path: "/latest";
    method: "get";
    request: {
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodArray<z.ZodObject<{
                        id: z.ZodString;
                        title: z.ZodString;
                        thumbnail: z.ZodString;
                        publishedAt: z.ZodString;
                        viewCount: z.ZodNullable<z.ZodString>;
                        url: z.ZodString;
                    }, z.core.$strip>>;
                };
            };
            description: string;
        };
        500: {
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
    getRoutingPath(): "/latest";
};
export type GetLatestVideosRoute = typeof getLatestVideos;
