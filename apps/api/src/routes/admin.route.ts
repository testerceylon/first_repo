import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { reviewSchema } from "./reviews.route";

import { errorMessageSchema } from "core/zod";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { adminMiddleware } from "@/middlewares/admin.middleware";

const tags: string[] = ["Admin"];

// Shared user schema
const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  role: z.string().nullable(),
  createdAt: z.string(),
  banned: z.boolean().nullable(),
});

// GET /admin/users
export const getUsers = createRoute({
  tags,
  summary: "Get all registered users",
  path: "/users",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    query: z.object({
      page: z.string().optional().default("1"),
      limit: z.string().optional().default("20"),
      search: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        users: z.array(adminUserSchema),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
      }),
      "Paginated list of users"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type GetUsersRoute = typeof getUsers;

// POST /admin/users
export const createUser = createRoute({
  tags,
  summary: "Create a new user account",
  path: "/users",
  method: "post",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().trim().min(1, "Name is required"),
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
            role: z.enum(["user", "admin", "agent"]).optional().default("user"),
            emailVerified: z.boolean().optional().default(false),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(adminUserSchema, "User created successfully"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorMessageSchema, "Invalid data or email already exists"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type CreateUserRoute = typeof createUser;

// GET /admin/analytics
export const getAnalytics = createRoute({
  tags,
  summary: "Get dashboard analytics overview",
  path: "/analytics",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        totalUsers: z.number(),
        newUsersThisMonth: z.number(),
        newUsersThisWeek: z.number(),
      }),
      "Analytics overview stats"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type GetAnalyticsRoute = typeof getAnalytics;

// GET /admin/analytics/ga4
export const getGA4Analytics = createRoute({
  tags,
  summary: "Get Google Analytics 4 data",
  path: "/analytics/ga4",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        metrics: z.object({
          totalVisitors: z.object({
            value: z.string(),
            change: z.string().optional(),
          }),
          pageViews: z.object({
            value: z.string(),
            change: z.string().optional(),
          }),
          avgSessionDuration: z.object({
            value: z.string(),
            change: z.string().optional(),
          }),
          bounceRate: z.object({
            value: z.string(),
            change: z.string().optional(),
          }),
          activeUsers: z.object({
            value: z.string(),
          }),
          conversionRate: z.object({
            value: z.string(),
            change: z.string().optional(),
          }),
        }),
        topPages: z.array(
          z.object({
            page: z.string(),
            views: z.string(),
            change: z.string(),
          })
        ),
        trafficSources: z.array(
          z.object({
            source: z.string(),
            visitors: z.string(),
            percentage: z.string(),
          })
        ),
      }),
      "Google Analytics 4 data"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
        details: z.string().optional(),
      }),
      "Failed to fetch analytics data"
    ),
  },
});

export type GetGA4AnalyticsRoute = typeof getGA4Analytics;

// GET /admin/analytics/user-chart?period=daily|weekly|monthly|yearly
export const getGA4UserChart = createRoute({
  tags,
  summary: "Get time-series visitor count for user count chart",
  path: "/analytics/user-chart",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    query: z.object({
      period: z.enum(["daily", "weekly", "monthly", "yearly"]).optional().default("daily"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        period: z.string(),
        data: z.array(
          z.object({
            label: z.string(),
            visitors: z.number(),
          })
        ),
      }),
      "Time-series visitor count data"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({ error: z.string(), details: z.string().optional() }),
      "Failed to fetch chart data"
    ),
  },
});

export type GetGA4UserChartRoute = typeof getGA4UserChart;

// GET /admin/users/:id
export const getUserById = createRoute({
  tags,
  summary: "Get a single user by ID",
  path: "/users/:id",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(adminUserSchema, "User details"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type GetUserByIdRoute = typeof getUserById;

// PATCH /admin/users/:id
export const updateUser = createRoute({
  tags,
  summary: "Update a user's name, role, plan, verification status, password, or ban status",
  path: "/users/:id",
  method: "patch",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().trim().min(1, "Name is required").optional(),
            email: z.string().email().optional(),
            role: z.enum(["user", "admin", "agent"]).optional(),
            emailVerified: z.boolean().optional(),
            password: z.string().min(8).optional().or(z.literal("")),
            banned: z.boolean().optional(),
            banReason: z.string().optional(),
          })
            // Transform empty password to undefined, handle empty name
            .transform((data) => ({
              ...data,
              password: data.password === "" ? undefined : data.password,
              name: data.name && data.name.trim() === "" ? undefined : data.name,
            })),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(adminUserSchema, "Updated user"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorMessageSchema, "Bad request"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type UpdateUserRoute = typeof updateUser;

// DELETE /admin/users/:id
export const deleteUser = createRoute({
  tags,
  summary: "Permanently delete a user account",
  path: "/users/:id",
  method: "delete",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({ message: z.string() }), "Deleted"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorMessageSchema, "Cannot delete own account"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});


export type DeleteUserRoute = typeof deleteUser;

// GET /admin/reviews
export const getAdminReviews = createRoute({
  tags,
  summary: "Get all reviews for admin",
  path: "/reviews",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  request: {},
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(reviewSchema.extend({ userEmail: z.string().optional() })),
      "List of all reviews"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type GetAdminReviewsRoute = typeof getAdminReviews;

// PATCH /admin/reviews/:id
export const updateReviewStatus = createRoute({
  tags,
  summary: "Approve or reject a review",
  path: "/reviews/:id",
  method: "patch",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(["approved", "rejected"]),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(reviewSchema, "Updated review"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type UpdateReviewStatusRoute = typeof updateReviewStatus;

// GET /admin/test-ga4
export const testGA4 = createRoute({
  tags,
  summary: "Test GA4 credentials and API access",
  path: "/test-ga4",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        timestamp: z.string(),
        checks: z.any(),
      }),
      "GA4 test results"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        timestamp: z.string(),
        checks: z.any(),
      }),
      "GA4 test failed"
    ),
  },
});

export type TestGA4Route = typeof testGA4;

// Shared blog post schema for admin (includes author info)
const adminBlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string(),
  authorId: z.string(),
  status: z.enum(["draft", "pending", "approved", "rejected"]),
  featuredImage: z.string().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  tags: z.string().nullable(),
  readingTime: z.string().nullable(),
  views: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  approvedAt: z.string().nullable(),
  approvedBy: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  author: z.object({ id: z.string(), name: z.string().nullable(), email: z.string() }).nullable().optional(),
});

// GET /admin/blog — List ALL posts from ALL authors
export const getAdminBlogPosts = createRoute({
  tags,
  summary: "Admin: List all blog posts",
  path: "/blog",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  request: {
    query: z.object({
      status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
      search: z.string().optional(),
      authorId: z.string().optional(),
      limit: z.string().optional(),
      offset: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ posts: z.array(adminBlogPostSchema), total: z.number() }),
      "All blog posts"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type GetAdminBlogPostsRoute = typeof getAdminBlogPosts;

// GET /admin/blog/authors — Distinct authors
export const getAdminBlogAuthors = createRoute({
  tags,
  summary: "Admin: List blog post authors",
  path: "/blog/authors",
  method: "get",
  middleware: [authMiddleware, adminMiddleware],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        authors: z.array(z.object({
          id: z.string(),
          name: z.string().nullable(),
          email: z.string(),
          postCount: z.number(),
        })),
      }),
      "Blog post authors"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
  },
});

export type GetAdminBlogAuthorsRoute = typeof getAdminBlogAuthors;
