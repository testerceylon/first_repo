import { z } from "@hono/zod-openapi";
export declare const subscribeNewsletter: {
    tags: string[];
    summary: string;
    path: "/subscribe";
    method: "post";
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        email: z.ZodString;
                        name: z.ZodOptional<z.ZodString>;
                        source: z.ZodDefault<z.ZodOptional<z.ZodString>>;
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
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        400: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        message: z.ZodString;
                    }, z.core.$strip>;
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
    getRoutingPath(): "/subscribe";
};
export type SubscribeNewsletterRoute = typeof subscribeNewsletter;
