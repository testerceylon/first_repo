declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
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
}, "/">;
export default router;
