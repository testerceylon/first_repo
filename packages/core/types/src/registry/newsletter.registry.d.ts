declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    "/subscribe": {
        $post: {
            input: {
                json: {
                    email: string;
                    name?: string | undefined;
                    source?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                json: {
                    email: string;
                    name?: string | undefined;
                    source?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                json: {
                    email: string;
                    name?: string | undefined;
                    source?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
export default router;
