import type { GetGA4AnalyticsRoute, GetGA4UserChartRoute } from "../routes/admin.route";
import type { APIRouteHandler } from "../types";
/**
 * Get Google Analytics data for admin dashboard
 * @route GET /api/admin/analytics/ga4
 */
export declare const getAnalyticsData: APIRouteHandler<GetGA4AnalyticsRoute>;
/**
 * Get time-series visitor count for the user count chart
 * @route GET /api/admin/analytics/user-chart?period=daily|weekly|monthly|yearly
 */
export declare const getUserChartData: APIRouteHandler<GetGA4UserChartRoute>;
