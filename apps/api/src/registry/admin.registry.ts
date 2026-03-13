import { createAPIRouter } from "@/lib/setup-api";

import * as handlers from "@/handlers/admin.handlers";
import * as routes from "@/routes/admin.route";
import { getAnalyticsData, getUserChartData } from "@/handlers/analytics.handlers";
import { testGA4Credentials } from "@/handlers/test-ga4.handlers";

const router = createAPIRouter()
  .openapi(routes.getUsers, handlers.getUsers)
  .openapi(routes.createUser, handlers.createUser)
  .openapi(routes.getUserById, handlers.getUserById)
  .openapi(routes.updateUser, handlers.updateUser)
  .openapi(routes.deleteUser, handlers.deleteUser)
  .openapi(routes.getAnalytics, handlers.getAnalytics)
  .openapi(routes.getGA4Analytics, getAnalyticsData)
  .openapi(routes.getGA4UserChart, getUserChartData)
  .openapi(routes.getAdminReviews, handlers.getAdminReviews)
  .openapi(routes.updateReviewStatus, handlers.updateReviewStatus)
  .openapi(routes.testGA4, testGA4Credentials)
  .openapi(routes.getAdminBlogAuthors, handlers.getAdminBlogAuthors)
  .openapi(routes.getAdminBlogPosts, handlers.getAdminBlogPosts);

export default router;
