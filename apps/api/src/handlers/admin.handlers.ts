import * as HttpStatusCodes from "stoker/http-status-codes";
import { and, count, desc, gte, ilike, or, eq } from "drizzle-orm";

import { users, accounts, blogPosts } from "core/database/schema";
import { getDatabase } from "core/database";
import { APIRouteHandler } from "@/types";
import { hashPassword } from "@/lib/password";

import type {
  GetUsersRoute,
  CreateUserRoute,
  GetAnalyticsRoute,
  GetUserByIdRoute,
  UpdateUserRoute,
  DeleteUserRoute,
  GetAdminReviewsRoute,
  UpdateReviewStatusRoute,
  GetAdminBlogPostsRoute,
  GetAdminBlogAuthorsRoute,
} from "@/routes/admin.route";
import { getAllReviewsAdmin, updateReviewStatus as dbUpdateReviewStatus } from "core/database/queries";



/**
 * GET /admin/users
 * Returns paginated list of all registered users.
 */
export const getUsers: APIRouteHandler<GetUsersRoute> = async (c) => {
  const db = getDatabase();
  const { page = "1", limit = "20", search } = c.req.valid("query");

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  const conditions: ReturnType<typeof ilike>[] = [];
  if (search) {
    conditions.push(
      ...[
        ilike(users.email, `%${search}%`),
        ilike(users.name, `%${search}%`),
      ]
    );
  }

  const whereClause = conditions.length
    ? or(...conditions)
    : undefined;

  const [userList, totalResult] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        role: users.role,
        createdAt: users.createdAt,
        banned: users.banned,
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limitNum)
      .offset(offset),
    db
      .select({ count: count() })
      .from(users)
      .where(whereClause),
  ]);

  return c.json(
    {
      users: userList.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      total: totalResult[0]?.count ?? 0,
      page: pageNum,
      limit: limitNum,
    },
    HttpStatusCodes.OK
  );
};

/**
 * POST /admin/users
 * Creates a new user account.
 */
export const createUser: APIRouteHandler<CreateUserRoute> = async (c) => {
  const db = getDatabase();
  const body = c.req.valid("json");

  console.log("[Admin] Create user request:", { body: { ...body, password: "***" } });

  try {
    // Check if email already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    if (existing) {
      return c.json(
        { message: "A user with this email already exists" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Hash the password using Better Auth's format
    const hashedPassword = await hashPassword(body.password);

    // Generate a unique ID for the user
    const userId = crypto.randomUUID();

    // Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        name: body.name,
        email: body.email,
        emailVerified: body.emailVerified ?? false,
        role: body.role ?? "user",
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        role: users.role,
        createdAt: users.createdAt,
        banned: users.banned,
      });

    // Create the credential account
    await db.insert(accounts).values({
      id: `${newUser.id}_credential`,
      userId: newUser.id,
      accountId: newUser.id,
      providerId: "credential",
      password: hashedPassword,
    });

    console.log("[Admin] User created successfully:", { userId: newUser.id, email: newUser.email });

    return c.json(
      { ...newUser, createdAt: newUser.createdAt.toISOString() },
      HttpStatusCodes.CREATED
    );
  } catch (err) {
    console.error("[Admin] Failed to create user:", err);
    return c.json(
      { message: "Failed to create user" },
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

/**
 * GET /admin/analytics
 * Returns overview analytics for the admin dashboard.
 */
export const getAnalytics: APIRouteHandler<GetAnalyticsRoute> = async (c) => {
  const db = getDatabase();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    totalResult,
    monthResult,
    weekResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startOfMonth)),
    db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, startOfWeek)),
  ]);

  return c.json(
    {
      totalUsers: totalResult[0]?.count ?? 0,
      newUsersThisMonth: monthResult[0]?.count ?? 0,
      newUsersThisWeek: weekResult[0]?.count ?? 0,
    },
    HttpStatusCodes.OK
  );
};



/**
 * GET /admin/users/:id
 * Returns a single user by their ID.
 */
export const getUserById: APIRouteHandler<GetUserByIdRoute> = async (c) => {
  const db = getDatabase();
  const { id } = c.req.valid("param");

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      role: users.role,
      createdAt: users.createdAt,
      banned: users.banned,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) {
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    { ...user, createdAt: user.createdAt.toISOString() },
    HttpStatusCodes.OK
  );
};

/**
 * PATCH /admin/users/:id
 * Updates a user's name, email, role, plan, verification status, password, or ban status.
 */
export const updateUser: APIRouteHandler<UpdateUserRoute> = async (c) => {
  const db = getDatabase();
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  
  console.log("[Admin] Update user request:", { userId: id, body });

  try {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existing) {
      return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
    }

    const patch: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
    if (body.name !== undefined) patch.name = body.name;
    if (body.email !== undefined) patch.email = body.email;
    if (body.role !== undefined) patch.role = body.role;
    if (body.emailVerified !== undefined) patch.emailVerified = body.emailVerified;
    if (body.banned !== undefined) {
      patch.banned = body.banned;
      patch.banReason = body.banReason ?? (body.banned ? "Admin action" : null);
    }

    // Update password if provided
    if (body.password !== undefined) {
      try {
        // Hash the password using Better Auth's format
        const hashedPassword = await hashPassword(body.password);

        // Find the email/password account for this user
        const [account] = await db
          .select({ id: accounts.id })
          .from(accounts)
          .where(
            and(
              eq(accounts.userId, id),
              eq(accounts.providerId, "credential")
            )
          )
          .limit(1);

        if (account) {
          // Update existing account
          await db
            .update(accounts)
            .set({ password: hashedPassword, updatedAt: new Date() })
            .where(eq(accounts.id, account.id));
        } else {
          // Create new credential account if it doesn't exist
          await db.insert(accounts).values({
            id: `${id}_credential`,
            userId: id,
            accountId: id,
            providerId: "credential",
            password: hashedPassword,
          });
        }
      } catch (err) {
        console.error("[Admin] Failed to update password:", err);
        return c.json(
          { message: "Failed to update password" },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    const [updated] = await db
      .update(users)
      .set(patch)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        role: users.role,
        createdAt: users.createdAt,
        banned: users.banned,
      });

    if (!updated) {
      console.error("[Admin] Update returned no rows for user:", id);
      return c.json(
        { message: "Failed to update user" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    return c.json(
      { ...updated, createdAt: updated.createdAt.toISOString() },
      HttpStatusCodes.OK
    );
  } catch (err) {
    console.error("[Admin] Error updating user:", err);
    return c.json(
      { message: err instanceof Error ? err.message : "Failed to update user" },
      HttpStatusCodes.BAD_REQUEST
    );
  }
};

/**
 * DELETE /admin/users/:id
 * Permanently deletes a user account. Admins cannot delete their own account.
 */
export const deleteUser: APIRouteHandler<DeleteUserRoute> = async (c) => {
  const db = getDatabase();
  const { id } = c.req.valid("param");
  const currentUser = c.get("user");

  if (currentUser?.id === id) {
    return c.json(
      { message: "You cannot delete your own account" },
      HttpStatusCodes.BAD_REQUEST
    );
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!existing) {
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }

  await db.delete(users).where(eq(users.id, id));


  return c.json({ message: "User deleted" }, HttpStatusCodes.OK);
};

/**
 * GET /admin/reviews
 * Returns all reviews for admin management.
 */
export const getAdminReviews: APIRouteHandler<GetAdminReviewsRoute> = async (c) => {
  const db = getDatabase();
  const result = await getAllReviewsAdmin(db);

  return c.json(
    result.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
    HttpStatusCodes.OK
  );
};

/**
 * PATCH /admin/reviews/:id
 * Approves or rejects a review.
 */
export const updateReviewStatus: APIRouteHandler<UpdateReviewStatusRoute> = async (c) => {
  const db = getDatabase();
  const { id } = c.req.valid("param");
  const { status } = c.req.valid("json");

  const result = await dbUpdateReviewStatus(db, id, status);

  if (!result) {
    return c.json({ message: "Review not found" } as any, HttpStatusCodes.NOT_FOUND as any);
  }

  return c.json(result, HttpStatusCodes.OK);
};

// GET /admin/blog — List all posts from all authors
export const getAdminBlogPosts: APIRouteHandler<GetAdminBlogPostsRoute> = async (c) => {
  const db = getDatabase();
  const { status, search, authorId } = c.req.valid("query");

  const conditions: any[] = [];
  if (status) conditions.push(eq(blogPosts.status, status as any));
  if (search) conditions.push(ilike(blogPosts.title, `%${search}%`));
  if (authorId) conditions.push(eq(blogPosts.authorId, authorId));

  const posts = await db.query.blogPosts.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    orderBy: [desc(blogPosts.createdAt)],
    with: {
      author: {
        columns: { id: true, name: true, email: true },
      },
    },
  });

  const serialized = posts.map((p: any) => ({
    ...p,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt?.toISOString() : p.updatedAt,
    approvedAt: p.approvedAt instanceof Date ? p.approvedAt?.toISOString() : p.approvedAt,
    publishedAt: p.publishedAt instanceof Date ? p.publishedAt?.toISOString() : p.publishedAt,
  }));

  return c.json({ posts: serialized, total: serialized.length }, HttpStatusCodes.OK);
};

// GET /admin/blog/authors — Distinct blog post authors with post count
export const getAdminBlogAuthors: APIRouteHandler<GetAdminBlogAuthorsRoute> = async (c) => {
  const db = getDatabase();

  const allPosts = await db.query.blogPosts.findMany({
    columns: { authorId: true },
  });

  const authorCounts = new Map<string, number>();
  for (const p of allPosts) {
    authorCounts.set(p.authorId, (authorCounts.get(p.authorId) || 0) + 1);
  }

  if (authorCounts.size === 0) {
    return c.json({ authors: [] }, HttpStatusCodes.OK);
  }

  const authorIds = Array.from(authorCounts.keys());
  const foundUsers = await db.query.users.findMany({
    where: (u, { inArray }) => inArray(u.id, authorIds),
    columns: { id: true, name: true, email: true },
  });

  const authors = foundUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    postCount: authorCounts.get(u.id) || 0,
  }));

  return c.json({ authors }, HttpStatusCodes.OK);
};
