import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { eq, desc, and, like, ilike } from "drizzle-orm";
import { nanoid } from "nanoid";

import { blogPosts, users } from "core/database/schema";
import type { APIRouteHandler } from "@/types";
import type {
  CreateBlogPostRoute,
  ListBlogPostsRoute,
  GetMyBlogPostsRoute,
  CheckSlugRoute,
  IncrementViewRoute,
  GetBlogPostRoute,
  UpdateBlogPostRoute,
  DeleteBlogPostRoute,
  SubmitBlogPostRoute,
  ApproveBlogPostRoute,
  RejectBlogPostRoute,
  GetPublicBlogPostsRoute,
  GetPublicBlogPostBySlugRoute,
} from "@/routes/blog.route";

// Helper to serialize blog post (convert Dates to strings)
function serializeBlogPost(post: any) {
  return {
    ...post,
    createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
    updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
    approvedAt: post.approvedAt instanceof Date ? post.approvedAt.toISOString() : post.approvedAt,
    publishedAt: post.publishedAt instanceof Date ? post.publishedAt.toISOString() : post.publishedAt,
  };
}

// Helper to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to calculate reading time (rough estimate)
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Create a new blog post
export const createBlogPost: APIRouteHandler<CreateBlogPostRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
    }

    const body = c.req.valid("json");
    const { title, content, excerpt, featuredImage, tags, metaTitle, metaDescription, readingTime } = body;

    // Determine slug: use provided or generate from title
    const baseSlug = body.slug ? body.slug : generateSlug(title);
    const slug = `${baseSlug}-${nanoid(6)}`;
    const calculatedReadingTime = readingTime || calculateReadingTime(content);

    // Determine status: agent can only set draft/pending, admin can set anything
    let status: "draft" | "pending" | "approved" = "draft";
    if (body.status) {
      if (user.role === "admin") {
        status = body.status as "draft" | "pending" | "approved";
      } else if (body.status === "pending") {
        status = "pending";
      }
    }

    // Determine author: admin can override, others use own id
    const authorId = (user.role === "admin" && body.authorId) ? body.authorId : user.id;

    const cleanFeaturedImage = featuredImage && featuredImage.trim() !== "" ? featuredImage : null;
    const cleanTags = tags && tags.trim() !== "" ? tags : null;

    const publishedAt = (status === "approved") ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null;

    const newPost = await db.insert(blogPosts).values({
      id: nanoid(),
      title,
      slug,
      content,
      excerpt,
      authorId,
      status,
      featuredImage: cleanFeaturedImage,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      tags: cleanTags,
      readingTime: calculatedReadingTime,
      publishedAt,
    }).returning();

    return c.json({ post: serializeBlogPost(newPost[0]) }, HttpStatusCodes.CREATED);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create blog post";
    return c.json(
      { error: errorMessage },
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

// List blog posts
export const listBlogPosts: APIRouteHandler<ListBlogPostsRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
    }

    const { status } = c.req.valid("query");

    let posts;

    if (user.role === "admin") {
      if (status) {
        posts = await db.query.blogPosts.findMany({
          where: eq(blogPosts.status, status as any),
          orderBy: [desc(blogPosts.createdAt)],
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      } else {
        posts = await db.query.blogPosts.findMany({
          orderBy: [desc(blogPosts.createdAt)],
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });
      }
    } else {
      posts = await db.query.blogPosts.findMany({
        where: eq(blogPosts.authorId, user.id),
        orderBy: [desc(blogPosts.createdAt)],
      });
    }

    return c.json({ posts: posts.map(serializeBlogPost) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
};

// Get single blog post
export const getBlogPost: APIRouteHandler<GetBlogPostRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
    }

    const { id } = c.req.valid("param");

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, HttpStatusCodes.NOT_FOUND);
    }

    if (user.role !== "admin" && post.authorId !== user.id) {
      return c.json({ error: "Forbidden" }, HttpStatusCodes.FORBIDDEN);
    }

    return c.json({ post: serializeBlogPost(post) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
};

// Update blog post
export const updateBlogPost: APIRouteHandler<UpdateBlogPostRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
    }

    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return c.json({ error: "Post not found" }, HttpStatusCodes.NOT_FOUND);
    }

    if (user.role !== "admin" && post.authorId !== user.id) {
      return c.json({ error: "Forbidden" }, HttpStatusCodes.FORBIDDEN);
    }

    const updateData: any = {};
    if (body.title && body.title !== post.title) {
      // Only regenerate slug if title changed AND article is not yet published
      updateData.title = body.title;
      // Keep slug permanent for approved/published articles (SEO & bookmarks)
      if (post.status !== "approved" && !post.publishedAt) {
        updateData.slug = `${generateSlug(body.title)}-${nanoid(6)}`;
      }
      // For approved articles, slug stays the same even if title changes
    } else if (body.title) {
      // Title provided but unchanged - just update title field
      updateData.title = body.title;
    }
    if (body.content) {
      updateData.content = body.content;
      updateData.readingTime = calculateReadingTime(body.content);
    }
    if (body.excerpt) updateData.excerpt = body.excerpt;
    if (body.featuredImage !== undefined) updateData.featuredImage = body.featuredImage;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDescription !== undefined) updateData.metaDescription = body.metaDescription;
    if (body.status && (user.role === "admin" || ["draft", "pending","rejected"].includes(body.status))) {
      updateData.status = body.status;
      // If admin is setting to approved, set published timestamps
      if (body.status === "approved" && user.role === "admin") {
        updateData.approvedAt = new Date();
        updateData.approvedBy = user.id;
        updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
        updateData.rejectionReason = null;
      }
      // If admin is setting to rejected, allow via PATCH too
      if (body.status === "rejected") {
        updateData.rejectionReason = (body as any).rejectionReason || post.rejectionReason;
      }
    }
    // Also handle readingTime and publishedAt updates for admin
    if (body.readingTime) updateData.readingTime = body.readingTime;
    if (body.publishedAt && user.role === "admin") updateData.publishedAt = new Date(body.publishedAt);

    const updatedPost = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();

    return c.json({ post: serializeBlogPost(updatedPost[0]) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
};

// Delete blog post
export const deleteBlogPost: APIRouteHandler<DeleteBlogPostRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
    }

    const { id } = c.req.valid("param");

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return c.json({ error: "Post not found" }, HttpStatusCodes.NOT_FOUND);
    }

    if (user.role !== "admin" && post.authorId !== user.id) {
      return c.json({ error: "Forbidden" }, HttpStatusCodes.FORBIDDEN);
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    return c.json({ message: "Post deleted successfully" }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
};

// Submit for review
export const submitBlogPost: APIRouteHandler<SubmitBlogPostRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
    }

    const { id } = c.req.valid("param");

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return c.json({ error: "Post not found" }, HttpStatusCodes.NOT_FOUND);
    }

    if (post.authorId !== user.id && user.role !== "admin") {
      return c.json({ error: "Forbidden" }, HttpStatusCodes.FORBIDDEN);
    }

    const updatedPost = await db
      .update(blogPosts)
      .set({ status: "pending" })
      .where(eq(blogPosts.id, id))
      .returning();

    return c.json({ post: serializeBlogPost(updatedPost[0]) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.UNAUTHORIZED
    );
  }
};

// Approve blog post
export const approveBlogPost: APIRouteHandler<ApproveBlogPostRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user || user.role !== "admin") {
      return c.json({ error: "Forbidden: Admin access required" }, HttpStatusCodes.FORBIDDEN);
    }

    const { id } = c.req.valid("param");

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return c.json({ error: "Post not found" }, HttpStatusCodes.NOT_FOUND);
    }

    const now = new Date();

    const updatedPost = await db
      .update(blogPosts)
      .set({
        status: "approved",
        approvedAt: now,
        approvedBy: user.id,
        publishedAt: now,
        rejectionReason: null,
      })
      .where(eq(blogPosts.id, id))
      .returning();

    return c.json({ post: serializeBlogPost(updatedPost[0]) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.FORBIDDEN
    );
  }
};

// Reject blog post
export const rejectBlogPost: APIRouteHandler<RejectBlogPostRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    
    if (!user || user.role !== "admin") {
      return c.json({ error: "Forbidden: Admin access required" }, HttpStatusCodes.FORBIDDEN);
    }

    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const { reason } = body;

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (!post) {
      return c.json({ error: "Post not found" }, HttpStatusCodes.NOT_FOUND);
    }

    const updatedPost = await db
      .update(blogPosts)
      .set({
        status: "rejected",
        rejectionReason: reason || "Post does not meet quality standards",
      })
      .where(eq(blogPosts.id, id))
      .returning();

    return c.json({ post: serializeBlogPost(updatedPost[0]) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.FORBIDDEN
    );
  }
};

// Get public blog posts
export const getPublicBlogPosts: APIRouteHandler<GetPublicBlogPostsRoute> = async (c) => {
  const db = c.get("db");
  
  const posts = await db.query.blogPosts.findMany({
    where: eq(blogPosts.status, "approved"),
    orderBy: [desc(blogPosts.publishedAt)],
    with: {
      author: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  return c.json({ posts: posts.map(serializeBlogPost) }, HttpStatusCodes.OK);
};

// Get own blog posts (agent/admin)
export const getMyBlogPosts: APIRouteHandler<GetMyBlogPostsRoute> = async (c) => {
  try {
    const user = c.get("user");
    const db = c.get("db");
    if (!user) return c.json({ error: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);

    const { status, search } = c.req.valid("query");

    const conditions: any[] = [eq(blogPosts.authorId, user.id)];
    if (status) conditions.push(eq(blogPosts.status, status as any));
    if (search) conditions.push(ilike(blogPosts.title, `%${search}%`));

    const posts = await db.query.blogPosts.findMany({
      where: and(...conditions),
      orderBy: [desc(blogPosts.createdAt)],
    });

    return c.json({ posts: posts.map(serializeBlogPost) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ error: (error as Error).message }, HttpStatusCodes.UNAUTHORIZED);
  }
};

// Check slug availability
export const checkSlug: APIRouteHandler<CheckSlugRoute> = async (c) => {
  try {
    const db = c.get("db");
    const { slug, excludeId } = c.req.valid("query");

    const conditions: any[] = [eq(blogPosts.slug, slug)];
    if (excludeId) {
      const { ne } = await import("drizzle-orm");
      conditions.push(ne(blogPosts.id, excludeId));
    }

    const existing = await db.query.blogPosts.findFirst({
      where: and(...conditions),
      columns: { id: true },
    });

    return c.json({ available: !existing }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json({ available: false }, HttpStatusCodes.OK);
  }
};

// Increment view count
export const incrementView: APIRouteHandler<IncrementViewRoute> = async (c) => {
  try {
    const db = c.get("db");
    const { id } = c.req.valid("param");

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
      columns: { id: true, views: true },
    });

    if (post) {
      await db
        .update(blogPosts)
        .set({ views: String(parseInt(post.views || "0") + 1) })
        .where(eq(blogPosts.id, post.id));
    }

    return c.json({ ok: true }, HttpStatusCodes.OK);
  } catch {
    return c.json({ ok: false }, HttpStatusCodes.OK);
  }
};

// Get public blog post by slug
export const getPublicBlogPostBySlug: APIRouteHandler<GetPublicBlogPostBySlugRoute> = async (c) => {
  try {
    const db = c.get("db");
    const { slug } = c.req.valid("param");

    const post = await db.query.blogPosts.findFirst({
      where: and(eq(blogPosts.slug, slug), eq(blogPosts.status, "approved")),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, HttpStatusCodes.NOT_FOUND);
    }

    await db
      .update(blogPosts)
      .set({ views: String(parseInt(post.views || "0") + 1) })
      .where(eq(blogPosts.id, post.id));

    return c.json({ post: serializeBlogPost(post) }, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      { error: (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.NOT_FOUND
    );
  }
};
