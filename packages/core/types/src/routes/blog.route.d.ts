import { z } from "@hono/zod-openapi";
declare const createBlogPostRoute: {
    method: "post";
    path: "/";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        body: {
            required: boolean;
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        title: z.ZodString;
                        slug: z.ZodOptional<z.ZodString>;
                        content: z.ZodString;
                        excerpt: z.ZodString;
                        status: z.ZodOptional<z.ZodEnum<{
                            pending: "pending";
                            approved: "approved";
                            draft: "draft";
                        }>>;
                        featuredImage: z.ZodOptional<z.ZodString>;
                        tags: z.ZodOptional<z.ZodString>;
                        metaTitle: z.ZodOptional<z.ZodString>;
                        metaDescription: z.ZodOptional<z.ZodString>;
                        readingTime: z.ZodOptional<z.ZodString>;
                        publishedAt: z.ZodOptional<z.ZodString>;
                        authorId: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        post: z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        400: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        422: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/";
};
declare const listBlogPostsRoute: {
    method: "get";
    path: "/";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        query: z.ZodObject<{
            status: z.ZodOptional<z.ZodEnum<{
                pending: "pending";
                approved: "approved";
                rejected: "rejected";
                draft: "draft";
            }>>;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        posts: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/";
};
declare const getBlogPostRoute: {
    method: "get";
    path: "/{id}";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        post: z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id";
};
declare const updateBlogPostRoute: {
    method: "patch";
    path: "/{id}";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: {
            required: boolean;
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        title: z.ZodOptional<z.ZodString>;
                        content: z.ZodOptional<z.ZodString>;
                        excerpt: z.ZodOptional<z.ZodString>;
                        featuredImage: z.ZodOptional<z.ZodString>;
                        tags: z.ZodOptional<z.ZodString>;
                        metaTitle: z.ZodOptional<z.ZodString>;
                        metaDescription: z.ZodOptional<z.ZodString>;
                        status: z.ZodOptional<z.ZodEnum<{
                            pending: "pending";
                            approved: "approved";
                            rejected: "rejected";
                            draft: "draft";
                        }>>;
                        readingTime: z.ZodOptional<z.ZodString>;
                        publishedAt: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        post: z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id";
};
declare const deleteBlogPostRoute: {
    method: "delete";
    path: "/{id}";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
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
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id";
};
declare const submitBlogPostRoute: {
    method: "post";
    path: "/{id}/submit";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        post: z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id/submit";
};
declare const approveBlogPostRoute: {
    method: "post";
    path: "/{id}/approve";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        post: z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id/approve";
};
declare const rejectBlogPostRoute: {
    method: "post";
    path: "/{id}/reject";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: {
            required: boolean;
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        reason: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        post: z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id/reject";
};
declare const getMyBlogPostsRoute: {
    method: "get";
    path: "/mine";
    tags: string[];
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        query: z.ZodObject<{
            status: z.ZodOptional<z.ZodEnum<{
                pending: "pending";
                approved: "approved";
                rejected: "rejected";
                draft: "draft";
            }>>;
            search: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        posts: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        401: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/mine";
};
declare const checkSlugRoute: {
    method: "get";
    path: "/check-slug";
    tags: string[];
    request: {
        query: z.ZodObject<{
            slug: z.ZodString;
            excludeId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        available: z.ZodBoolean;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/check-slug";
};
declare const incrementViewRoute: {
    method: "patch";
    path: "/{id}/view";
    tags: string[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        ok: z.ZodBoolean;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/:id/view";
};
declare const getPublicBlogPostsRoute: {
    method: "get";
    path: "/public";
    tags: string[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        posts: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/public";
};
declare const getPublicBlogPostBySlugRoute: {
    method: "get";
    path: "/public/{slug}";
    tags: string[];
    request: {
        params: z.ZodObject<{
            slug: z.ZodString;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        post: z.ZodObject<{
                            id: z.ZodString;
                            title: z.ZodString;
                            slug: z.ZodString;
                            content: z.ZodString;
                            excerpt: z.ZodString;
                            authorId: z.ZodString;
                            status: z.ZodEnum<{
                                pending: "pending";
                                approved: "approved";
                                rejected: "rejected";
                                draft: "draft";
                            }>;
                            featuredImage: z.ZodNullable<z.ZodString>;
                            metaTitle: z.ZodNullable<z.ZodString>;
                            metaDescription: z.ZodNullable<z.ZodString>;
                            tags: z.ZodNullable<z.ZodString>;
                            readingTime: z.ZodNullable<z.ZodString>;
                            views: z.ZodNullable<z.ZodString>;
                            rejectionReason: z.ZodNullable<z.ZodString>;
                            approvedAt: z.ZodNullable<z.ZodString>;
                            approvedBy: z.ZodNullable<z.ZodString>;
                            publishedAt: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            updatedAt: z.ZodNullable<z.ZodString>;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        error: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/public/:slug";
};
declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
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
}, "/">;
export default router;
export type CreateBlogPostRoute = typeof createBlogPostRoute;
export type ListBlogPostsRoute = typeof listBlogPostsRoute;
export type GetMyBlogPostsRoute = typeof getMyBlogPostsRoute;
export type CheckSlugRoute = typeof checkSlugRoute;
export type IncrementViewRoute = typeof incrementViewRoute;
export type GetBlogPostRoute = typeof getBlogPostRoute;
export type UpdateBlogPostRoute = typeof updateBlogPostRoute;
export type DeleteBlogPostRoute = typeof deleteBlogPostRoute;
export type SubmitBlogPostRoute = typeof submitBlogPostRoute;
export type ApproveBlogPostRoute = typeof approveBlogPostRoute;
export type RejectBlogPostRoute = typeof rejectBlogPostRoute;
export type GetPublicBlogPostsRoute = typeof getPublicBlogPostsRoute;
export type GetPublicBlogPostBySlugRoute = typeof getPublicBlogPostBySlugRoute;
