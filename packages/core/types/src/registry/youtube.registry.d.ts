declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    "/latest": {
        $get: {
            input: {
                query: {
                    limit?: string | undefined;
                };
            };
            output: {
                id: string;
                title: string;
                thumbnail: string;
                publishedAt: string;
                viewCount: string | null;
                url: string;
            }[];
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                query: {
                    limit?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/">;
export default router;
