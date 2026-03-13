declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
    "/": {
        $get: {
            input: {};
            output: {
                id: string;
                userId: string;
                userName: string | null;
                content: string;
                rating: number;
                status: "pending" | "approved" | "rejected";
                createdAt: string;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    content: string;
                    rating: number;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    content: string;
                    rating: number;
                };
            };
            output: {
                id: string;
                userId: string;
                userName: string | null;
                content: string;
                rating: number;
                status: "pending" | "approved" | "rejected";
                createdAt: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
export default router;
