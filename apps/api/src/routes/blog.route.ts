import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createAPIRouter } from "@/lib/setup-api";
import { authMiddleware } from "@/middlewares/auth.middleware";

import * as handlers from "@/handlers/blog.handlers";

const tags = ["Blog"];

const errorSchema = z.object({
  error: z.string(),
});

// Schema that matches the actual database return types (JSON serialized)
const blogPostSchema = z.object({
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
});

// Create blog post
const createBlogPostRoute = createRoute({
  method: "post",
  path: "/",
  tags,
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().optional(),
        content: z.string().min(1),
        excerpt: z.string().min(1).max(500),
        status: z.enum(["draft", "pending", "approved"]).optional(),
        featuredImage: z.string().optional(),
        tags: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        readingTime: z.string().optional(),
        publishedAt: z.string().optional(),
        authorId: z.string().optional(),
      }),
      "Blog post data"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({ post: blogPostSchema }),
      "Blog post created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorSchema,
      "Bad request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorSchema,
      "Validation error"
    ),
  },
});

// List blog posts
const listBlogPostsRoute = createRoute({
  method: "get",
  path: "/",
  tags,
  middleware: [authMiddleware],
  request: {
    query: z.object({
      status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ posts: z.array(blogPostSchema) }),
      "List of blog posts"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorSchema,
      "Unauthorized"
    ),
  },
});

// Get single blog post
const getBlogPostRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags,
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ post: blogPostSchema }),
      "Blog post details"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorSchema, "Unauthorized"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Post not found"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorSchema, "Forbidden"),
  },
});

// Update blog post
const updateBlogPostRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags,
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        featuredImage: z.string().optional(),
        tags: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
        readingTime: z.string().optional(),
        publishedAt: z.string().optional(),
      }),
      "Blog post updates"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ post: blogPostSchema }),
      "Blog post updated"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorSchema, "Unauthorized"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Post not found"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorSchema, "Forbidden"),
  },
});

// Delete blog post
const deleteBlogPostRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags,
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Blog post deleted"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorSchema, "Unauthorized"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Post not found"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorSchema, "Forbidden"),
  },
});

// Submit for review
const submitBlogPostRoute = createRoute({
  method: "post",
  path: "/{id}/submit",
  tags,
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ post: blogPostSchema }),
      "Blog post submitted for review"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorSchema, "Unauthorized"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Post not found"),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorSchema, "Forbidden"),
  },
});

// Approve blog post
const approveBlogPostRoute = createRoute({
  method: "post",
  path: "/{id}/approve",
  tags,
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ post: blogPostSchema }),
      "Blog post approved"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorSchema, "Admin access required"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Post not found"),
  },
});

// Reject blog post
const rejectBlogPostRoute = createRoute({
  method: "post",
  path: "/{id}/reject",
  tags,
  middleware: [authMiddleware],
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      z.object({
        reason: z.string().optional(),
      }),
      "Rejection reason"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ post: blogPostSchema }),
      "Blog post rejected"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorSchema, "Admin access required"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Post not found"),
  },
});

// Get own blog posts (agent/admin)
const getMyBlogPostsRoute = createRoute({
  method: "get",
  path: "/mine",
  tags,
  middleware: [authMiddleware],
  request: {
    query: z.object({
      status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
      search: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ posts: z.array(blogPostSchema) }),
      "Own blog posts"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorSchema, "Unauthorized"),
  },
});

// Check slug availability
const checkSlugRoute = createRoute({
  method: "get",
  path: "/check-slug",
  tags,
  request: {
    query: z.object({
      slug: z.string(),
      excludeId: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ available: z.boolean() }),
      "Slug availability"
    ),
  },
});

// Increment view count (public, fire-and-forget)
const incrementViewRoute = createRoute({
  method: "patch",
  path: "/{id}/view",
  tags,
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ ok: z.boolean() }),
      "View incremented"
    ),
  },
});

// Public routes (no auth)
const getPublicBlogPostsRoute = createRoute({
  method: "get",
  path: "/public",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ posts: z.array(blogPostSchema) }),
      "Public blog posts"
    ),
  },
});

const getPublicBlogPostBySlugRoute = createRoute({
  method: "get",
  path: "/public/{slug}",
  tags,
  request: {
    params: z.object({
      slug: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ post: blogPostSchema }),
      "Public blog post"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorSchema, "Post not found"),
  },
});

const router = createAPIRouter()
  .openapi(createBlogPostRoute, handlers.createBlogPost)
  // Register specific paths BEFORE parameterized routes to avoid conflicts
  .openapi(getMyBlogPostsRoute, handlers.getMyBlogPosts)
  .openapi(checkSlugRoute, handlers.checkSlug)
  .openapi(listBlogPostsRoute, handlers.listBlogPosts)
  .openapi(getPublicBlogPostsRoute, handlers.getPublicBlogPosts)
  .openapi(getPublicBlogPostBySlugRoute, handlers.getPublicBlogPostBySlug)
  .openapi(getBlogPostRoute, handlers.getBlogPost)
  .openapi(incrementViewRoute, handlers.incrementView)
  .openapi(updateBlogPostRoute, handlers.updateBlogPost)
  .openapi(deleteBlogPostRoute, handlers.deleteBlogPost)
  .openapi(submitBlogPostRoute, handlers.submitBlogPost)
  .openapi(approveBlogPostRoute, handlers.approveBlogPost)
  .openapi(rejectBlogPostRoute, handlers.rejectBlogPost);

export default router;

// Export route types for handlers
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
