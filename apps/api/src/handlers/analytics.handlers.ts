import { getAllAnalyticsData, getUserCountChart } from "../lib/ga4.service";
import type { GetGA4AnalyticsRoute, GetGA4UserChartRoute } from "../routes/admin.route";
import type { APIRouteHandler } from "../types";

/**
 * Get Google Analytics data for admin dashboard
 * @route GET /api/admin/analytics/ga4
 */
export const getAnalyticsData: APIRouteHandler<GetGA4AnalyticsRoute> = async (c) => {
  try {
    console.log("[Analytics] Fetching GA4 data...");
    console.log("[Analytics] Environment check:", {
      hasPropertyId: !!process.env.GA4_PROPERTY_ID,
      hasEmail: !!process.env.GA4_SERVICE_ACCOUNT_EMAIL,
      hasKey: !!process.env.GA4_PRIVATE_KEY,
      propertyId: process.env.GA4_PROPERTY_ID,
    });
    
    const data = await getAllAnalyticsData();
    
    console.log("[Analytics] Successfully fetched GA4 data");
    
    return c.json(data, 200);
  } catch (error) {
    console.error("[Analytics] Error fetching GA4 data:", error);
    
    // Provide detailed error information
    let errorMessage = "Failed to fetch analytics data";
    let errorDetails = "Unknown error";
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Check for specific error types
      if (error.message.includes("environment variable")) {
        errorMessage = "Google Analytics credentials not configured";
        errorDetails = error.message + ". Please add GA4_PROPERTY_ID, GA4_SERVICE_ACCOUNT_EMAIL, and GA4_PRIVATE_KEY to your environment variables.";
      } else if (error.message.includes("has not been used") || error.message.includes("disabled")) {
        errorMessage = "Google Analytics Data API not enabled";
        errorDetails = "Please enable the Google Analytics Data API in Google Cloud Console and wait 2-3 minutes for activation.";
      }
    }
    
    return c.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      500
    );
  }
};

/**
 * Get time-series visitor count for the user count chart
 * @route GET /api/admin/analytics/user-chart?period=daily|weekly|monthly|yearly
 */
export const getUserChartData: APIRouteHandler<GetGA4UserChartRoute> = async (c) => {
  try {
    const { period } = c.req.valid("query");
    const data = await getUserCountChart(period as string);
    return c.json({ period, data }, 200);
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: "Failed to fetch chart data", details }, 500);
  }
};
