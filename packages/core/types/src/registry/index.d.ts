import { OpenAPI } from "./types";
export declare function registerRoutes(app: OpenAPI): import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, import("hono/types").MergeSchemaPath<{
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
}, "/api/newsletter"> & import("hono/types").MergeSchemaPath<{
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
}, "/api/youtube"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 422;
        };
    };
} & {
    "/mine": {
        $get: {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/check-slug": {
        $get: {
            input: {
                query: {
                    slug: string;
                    excludeId?: string | undefined;
                };
            };
            output: {
                available: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $get: {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                };
            };
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/public": {
        $get: {
            input: {};
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/public/:slug": {
        $get: {
            input: {
                param: {
                    slug: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    slug: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/:id/view": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                ok: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id/submit": {
        $post: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id/approve": {
        $post: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id/reject": {
        $post: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    reason?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    reason?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    reason?: string | undefined;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/blog"> & import("hono/types").MergeSchemaPath<{
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
}, "/api/reviews"> & import("hono/types").MergeSchemaPath<{
    "/users": {
        $get: {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                users: {
                    id: string;
                    name: string;
                    email: string;
                    emailVerified: boolean;
                    role: string | null;
                    createdAt: string;
                    banned: boolean | null;
                }[];
                total: number;
                page: number;
                limit: number;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        };
    };
} & {
    "/users": {
        $post: {
            input: {
                json: {
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
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
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                json: {
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                };
            };
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: string | null;
                createdAt: string;
                banned: boolean | null;
            };
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        };
    };
} & {
    "/users/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: string | null;
                createdAt: string;
                banned: boolean | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/users/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: string | null;
                createdAt: string;
                banned: boolean | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/users/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/analytics": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                totalUsers: number;
                newUsersThisMonth: number;
                newUsersThisWeek: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/analytics/ga4": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                metrics: {
                    totalVisitors: {
                        value: string;
                        change?: string | undefined;
                    };
                    pageViews: {
                        value: string;
                        change?: string | undefined;
                    };
                    avgSessionDuration: {
                        value: string;
                        change?: string | undefined;
                    };
                    bounceRate: {
                        value: string;
                        change?: string | undefined;
                    };
                    activeUsers: {
                        value: string;
                    };
                    conversionRate: {
                        value: string;
                        change?: string | undefined;
                    };
                };
                topPages: {
                    page: string;
                    views: string;
                    change: string;
                }[];
                trafficSources: {
                    source: string;
                    visitors: string;
                    percentage: string;
                }[];
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {};
            output: {
                error: string;
                details?: string | undefined;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/analytics/user-chart": {
        $get: {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                period: string;
                data: {
                    label: string;
                    visitors: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                error: string;
                details?: string | undefined;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/reviews": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                id: string;
                userId: string;
                userName: string | null;
                content: string;
                rating: number;
                status: "pending" | "approved" | "rejected";
                createdAt: string;
                userEmail?: string | undefined;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/reviews/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
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
} & {
    [x: string]: {
        $get: {
            input: {
                param: {
                    [x: string]: string;
                };
            };
            output: {
                timestamp: string;
                checks: any;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    [x: string]: string;
                };
            };
            output: {
                timestamp: string;
                checks: any;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/blog/authors": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                authors: {
                    id: string;
                    name: string | null;
                    email: string;
                    postCount: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/blog": {
        $get: {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                    authorId?: string | undefined;
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                    authorId?: string | undefined;
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                    authorId?: string | undefined;
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            };
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                    author?: {
                        id: string;
                        name: string | null;
                        email: string;
                    } | null | undefined;
                }[];
                total: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/admin"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                message: string;
                auth: {
                    user: any;
                    session: any;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api">, "/api">;
export declare const router: import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, import("hono/types").MergeSchemaPath<{
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
}, "/api/newsletter"> & import("hono/types").MergeSchemaPath<{
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
}, "/api/youtube"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    title: string;
                    content: string;
                    excerpt: string;
                    slug?: string | undefined;
                    status?: "pending" | "approved" | "draft" | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                    authorId?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 422;
        };
    };
} & {
    "/mine": {
        $get: {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/check-slug": {
        $get: {
            input: {
                query: {
                    slug: string;
                    excludeId?: string | undefined;
                };
            };
            output: {
                available: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $get: {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                };
            };
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/public": {
        $get: {
            input: {};
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/public/:slug": {
        $get: {
            input: {
                param: {
                    slug: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    slug: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/:id/view": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                ok: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    title?: string | undefined;
                    content?: string | undefined;
                    excerpt?: string | undefined;
                    featuredImage?: string | undefined;
                    tags?: string | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    readingTime?: string | undefined;
                    publishedAt?: string | undefined;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id/submit": {
        $post: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id/approve": {
        $post: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:id/reject": {
        $post: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    reason?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    reason?: string | undefined;
                };
            };
            output: {
                error: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    reason?: string | undefined;
                };
            };
            output: {
                post: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/blog"> & import("hono/types").MergeSchemaPath<{
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
}, "/api/reviews"> & import("hono/types").MergeSchemaPath<{
    "/users": {
        $get: {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                users: {
                    id: string;
                    name: string;
                    email: string;
                    emailVerified: boolean;
                    role: string | null;
                    createdAt: string;
                    banned: boolean | null;
                }[];
                total: number;
                page: number;
                limit: number;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        };
    };
} & {
    "/users": {
        $post: {
            input: {
                json: {
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
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
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                json: {
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                };
            };
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: string | null;
                createdAt: string;
                banned: boolean | null;
            };
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    name: string;
                    email: string;
                    password: string;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        };
    };
} & {
    "/users/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: string | null;
                createdAt: string;
                banned: boolean | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/users/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: string | null;
                createdAt: string;
                banned: boolean | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    email?: string | undefined;
                    role?: "user" | "admin" | "agent" | undefined;
                    emailVerified?: boolean | undefined;
                    password?: string | undefined;
                    banned?: boolean | undefined;
                    banReason?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/users/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/analytics": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                totalUsers: number;
                newUsersThisMonth: number;
                newUsersThisWeek: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/analytics/ga4": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                metrics: {
                    totalVisitors: {
                        value: string;
                        change?: string | undefined;
                    };
                    pageViews: {
                        value: string;
                        change?: string | undefined;
                    };
                    avgSessionDuration: {
                        value: string;
                        change?: string | undefined;
                    };
                    bounceRate: {
                        value: string;
                        change?: string | undefined;
                    };
                    activeUsers: {
                        value: string;
                    };
                    conversionRate: {
                        value: string;
                        change?: string | undefined;
                    };
                };
                topPages: {
                    page: string;
                    views: string;
                    change: string;
                }[];
                trafficSources: {
                    source: string;
                    visitors: string;
                    percentage: string;
                }[];
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {};
            output: {
                error: string;
                details?: string | undefined;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/analytics/user-chart": {
        $get: {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                period: string;
                data: {
                    label: string;
                    visitors: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                query: {
                    period?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                };
            };
            output: {
                error: string;
                details?: string | undefined;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/reviews": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                id: string;
                userId: string;
                userName: string | null;
                content: string;
                rating: number;
                status: "pending" | "approved" | "rejected";
                createdAt: string;
                userEmail?: string | undefined;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/reviews/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    status: "approved" | "rejected";
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
} & {
    [x: string]: {
        $get: {
            input: {
                param: {
                    [x: string]: string;
                };
            };
            output: {
                timestamp: string;
                checks: any;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    [x: string]: string;
                };
            };
            output: {
                timestamp: string;
                checks: any;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/blog/authors": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                authors: {
                    id: string;
                    name: string | null;
                    email: string;
                    postCount: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/blog": {
        $get: {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                    authorId?: string | undefined;
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                    authorId?: string | undefined;
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                query: {
                    status?: "pending" | "approved" | "rejected" | "draft" | undefined;
                    search?: string | undefined;
                    authorId?: string | undefined;
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            };
            output: {
                posts: {
                    id: string;
                    title: string;
                    slug: string;
                    content: string;
                    excerpt: string;
                    authorId: string;
                    status: "pending" | "approved" | "rejected" | "draft";
                    featuredImage: string | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                    tags: string | null;
                    readingTime: string | null;
                    views: string | null;
                    rejectionReason: string | null;
                    approvedAt: string | null;
                    approvedBy: string | null;
                    publishedAt: string | null;
                    createdAt: string;
                    updatedAt: string | null;
                    author?: {
                        id: string;
                        name: string | null;
                        email: string;
                    } | null | undefined;
                }[];
                total: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/admin"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                message: string;
                auth: {
                    user: any;
                    session: any;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api">, "/api">;
export type Router = typeof router;
