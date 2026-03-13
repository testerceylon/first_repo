import { APIRouteHandler } from "./types";
import type { GetUsersRoute, CreateUserRoute, GetAnalyticsRoute, GetUserByIdRoute, UpdateUserRoute, DeleteUserRoute, GetAdminReviewsRoute, UpdateReviewStatusRoute, GetAdminBlogPostsRoute, GetAdminBlogAuthorsRoute } from "./routes/admin.route";
/**
 * GET /admin/users
 * Returns paginated list of all registered users.
 */
export declare const getUsers: APIRouteHandler<GetUsersRoute>;
/**
 * POST /admin/users
 * Creates a new user account.
 */
export declare const createUser: APIRouteHandler<CreateUserRoute>;
/**
 * GET /admin/analytics
 * Returns overview analytics for the admin dashboard.
 */
export declare const getAnalytics: APIRouteHandler<GetAnalyticsRoute>;
/**
 * GET /admin/users/:id
 * Returns a single user by their ID.
 */
export declare const getUserById: APIRouteHandler<GetUserByIdRoute>;
/**
 * PATCH /admin/users/:id
 * Updates a user's name, email, role, plan, verification status, password, or ban status.
 */
export declare const updateUser: APIRouteHandler<UpdateUserRoute>;
/**
 * DELETE /admin/users/:id
 * Permanently deletes a user account. Admins cannot delete their own account.
 */
export declare const deleteUser: APIRouteHandler<DeleteUserRoute>;
/**
 * GET /admin/reviews
 * Returns all reviews for admin management.
 */
export declare const getAdminReviews: APIRouteHandler<GetAdminReviewsRoute>;
/**
 * PATCH /admin/reviews/:id
 * Approves or rejects a review.
 */
export declare const updateReviewStatus: APIRouteHandler<UpdateReviewStatusRoute>;
export declare const getAdminBlogPosts: APIRouteHandler<GetAdminBlogPostsRoute>;
export declare const getAdminBlogAuthors: APIRouteHandler<GetAdminBlogAuthorsRoute>;
