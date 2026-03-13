import { z } from "@hono/zod-openapi";
export declare const getUsers: {
    tags: string[];
    summary: string;
    path: "/users";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        query: z.ZodObject<{
            page: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            limit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            search: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        users: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodString;
                            email: z.ZodString;
                            emailVerified: z.ZodBoolean;
                            role: z.ZodNullable<z.ZodString>;
                            createdAt: z.ZodString;
                            banned: z.ZodNullable<z.ZodBoolean>;
                        }, z.core.$strip>>;
                        total: z.ZodNumber;
                        page: z.ZodNumber;
                        limit: z.ZodNumber;
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
        403: {
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
    getRoutingPath(): "/users";
};
export type GetUsersRoute = typeof getUsers;
export declare const createUser: {
    tags: string[];
    summary: string;
    path: "/users";
    method: "post";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        body: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        name: z.ZodString;
                        email: z.ZodString;
                        password: z.ZodString;
                        role: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
                            user: "user";
                            admin: "admin";
                            agent: "agent";
                        }>>>;
                        emailVerified: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                    }, z.core.$strip>;
                };
            };
        };
    };
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        id: z.ZodString;
                        name: z.ZodString;
                        email: z.ZodString;
                        emailVerified: z.ZodBoolean;
                        role: z.ZodNullable<z.ZodString>;
                        createdAt: z.ZodString;
                        banned: z.ZodNullable<z.ZodBoolean>;
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
        403: {
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
    getRoutingPath(): "/users";
};
export type CreateUserRoute = typeof createUser;
export declare const getAnalytics: {
    tags: string[];
    summary: string;
    path: "/analytics";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        totalUsers: z.ZodNumber;
                        newUsersThisMonth: z.ZodNumber;
                        newUsersThisWeek: z.ZodNumber;
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
        403: {
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
    getRoutingPath(): "/analytics";
};
export type GetAnalyticsRoute = typeof getAnalytics;
export declare const getGA4Analytics: {
    tags: string[];
    summary: string;
    path: "/analytics/ga4";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        metrics: z.ZodObject<{
                            totalVisitors: z.ZodObject<{
                                value: z.ZodString;
                                change: z.ZodOptional<z.ZodString>;
                            }, z.core.$strip>;
                            pageViews: z.ZodObject<{
                                value: z.ZodString;
                                change: z.ZodOptional<z.ZodString>;
                            }, z.core.$strip>;
                            avgSessionDuration: z.ZodObject<{
                                value: z.ZodString;
                                change: z.ZodOptional<z.ZodString>;
                            }, z.core.$strip>;
                            bounceRate: z.ZodObject<{
                                value: z.ZodString;
                                change: z.ZodOptional<z.ZodString>;
                            }, z.core.$strip>;
                            activeUsers: z.ZodObject<{
                                value: z.ZodString;
                            }, z.core.$strip>;
                            conversionRate: z.ZodObject<{
                                value: z.ZodString;
                                change: z.ZodOptional<z.ZodString>;
                            }, z.core.$strip>;
                        }, z.core.$strip>;
                        topPages: z.ZodArray<z.ZodObject<{
                            page: z.ZodString;
                            views: z.ZodString;
                            change: z.ZodString;
                        }, z.core.$strip>>;
                        trafficSources: z.ZodArray<z.ZodObject<{
                            source: z.ZodString;
                            visitors: z.ZodString;
                            percentage: z.ZodString;
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
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
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
                        error: z.ZodString;
                        details: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/analytics/ga4";
};
export type GetGA4AnalyticsRoute = typeof getGA4Analytics;
export declare const getGA4UserChart: {
    tags: string[];
    summary: string;
    path: "/analytics/user-chart";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        query: z.ZodObject<{
            period: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
                daily: "daily";
                weekly: "weekly";
                monthly: "monthly";
                yearly: "yearly";
            }>>>;
        }, z.core.$strip>;
    };
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        period: z.ZodString;
                        data: z.ZodArray<z.ZodObject<{
                            label: z.ZodString;
                            visitors: z.ZodNumber;
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
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
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
                        error: z.ZodString;
                        details: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/analytics/user-chart";
};
export type GetGA4UserChartRoute = typeof getGA4UserChart;
export declare const getUserById: {
    tags: string[];
    summary: string;
    path: "/users/:id";
    method: "get";
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
                        id: z.ZodString;
                        name: z.ZodString;
                        email: z.ZodString;
                        emailVerified: z.ZodBoolean;
                        role: z.ZodNullable<z.ZodString>;
                        createdAt: z.ZodString;
                        banned: z.ZodNullable<z.ZodBoolean>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
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
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
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
    getRoutingPath(): "/users/:id";
};
export type GetUserByIdRoute = typeof getUserById;
export declare const updateUser: {
    tags: string[];
    summary: string;
    path: "/users/:id";
    method: "patch";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: {
            content: {
                "application/json": {
                    schema: z.ZodPipe<z.ZodObject<{
                        name: z.ZodOptional<z.ZodString>;
                        email: z.ZodOptional<z.ZodString>;
                        role: z.ZodOptional<z.ZodEnum<{
                            user: "user";
                            admin: "admin";
                            agent: "agent";
                        }>>;
                        emailVerified: z.ZodOptional<z.ZodBoolean>;
                        password: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                        banned: z.ZodOptional<z.ZodBoolean>;
                        banReason: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>, z.ZodTransform<{
                        password: string | undefined;
                        name: string | undefined;
                        email?: string | undefined;
                        role?: "user" | "admin" | "agent" | undefined;
                        emailVerified?: boolean | undefined;
                        banned?: boolean | undefined;
                        banReason?: string | undefined;
                    }, {
                        name?: string | undefined;
                        email?: string | undefined;
                        role?: "user" | "admin" | "agent" | undefined;
                        emailVerified?: boolean | undefined;
                        password?: string | undefined;
                        banned?: boolean | undefined;
                        banReason?: string | undefined;
                    }>>;
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
                        name: z.ZodString;
                        email: z.ZodString;
                        emailVerified: z.ZodBoolean;
                        role: z.ZodNullable<z.ZodString>;
                        createdAt: z.ZodString;
                        banned: z.ZodNullable<z.ZodBoolean>;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        404: {
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
        403: {
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
    getRoutingPath(): "/users/:id";
};
export type UpdateUserRoute = typeof updateUser;
export declare const deleteUser: {
    tags: string[];
    summary: string;
    path: "/users/:id";
    method: "delete";
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
        404: {
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
        403: {
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
    getRoutingPath(): "/users/:id";
};
export type DeleteUserRoute = typeof deleteUser;
export declare const getAdminReviews: {
    tags: string[];
    summary: string;
    path: "/reviews";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {};
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
                        userEmail: z.ZodOptional<z.ZodString>;
                    }, z.core.$strip>>;
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
        403: {
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
    getRoutingPath(): "/reviews";
};
export type GetAdminReviewsRoute = typeof getAdminReviews;
export declare const updateReviewStatus: {
    tags: string[];
    summary: string;
    path: "/reviews/:id";
    method: "patch";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    request: {
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        status: z.ZodEnum<{
                            approved: "approved";
                            rejected: "rejected";
                        }>;
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
        404: {
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
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
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
    getRoutingPath(): "/reviews/:id";
};
export type UpdateReviewStatusRoute = typeof updateReviewStatus;
export declare const testGA4: {
    tags: string[];
    summary: string;
    path: "/test-ga4";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        timestamp: z.ZodString;
                        checks: z.ZodAny;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        500: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        timestamp: z.ZodString;
                        checks: z.ZodAny;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
    };
} & {
    getRoutingPath(): "/test-ga4";
};
export type TestGA4Route = typeof testGA4;
export declare const getAdminBlogPosts: {
    tags: string[];
    summary: string;
    path: "/blog";
    method: "get";
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
            authorId: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodString>;
            offset: z.ZodOptional<z.ZodString>;
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
                            author: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                                id: z.ZodString;
                                name: z.ZodNullable<z.ZodString>;
                                email: z.ZodString;
                            }, z.core.$strip>>>;
                        }, z.core.$strip>>;
                        total: z.ZodNumber;
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
        403: {
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
    getRoutingPath(): "/blog";
};
export type GetAdminBlogPostsRoute = typeof getAdminBlogPosts;
export declare const getAdminBlogAuthors: {
    tags: string[];
    summary: string;
    path: "/blog/authors";
    method: "get";
    middleware: import("hono").MiddlewareHandler<import("../types").APIBindings>[];
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.ZodObject<{
                        authors: z.ZodArray<z.ZodObject<{
                            id: z.ZodString;
                            name: z.ZodNullable<z.ZodString>;
                            email: z.ZodString;
                            postCount: z.ZodNumber;
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
                        message: z.ZodString;
                    }, z.core.$strip>;
                };
            };
            description: string;
        };
        403: {
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
    getRoutingPath(): "/blog/authors";
};
export type GetAdminBlogAuthorsRoute = typeof getAdminBlogAuthors;
