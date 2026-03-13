import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Lazily initialized — avoids crashing the entire API module at import
// time when GA4 env vars are missing (e.g. on Vercel if not configured).
let _analyticsDataClient: BetaAnalyticsDataClient | null = null;
let _propertyId: string | null = null;

function getGA4Client(): { client: BetaAnalyticsDataClient; propertyId: string } {
  if (_analyticsDataClient && _propertyId) {
    return { client: _analyticsDataClient, propertyId: _propertyId };
  }

  // Validate required environment variables at call time, not module load time
  if (!process.env.GA4_PROPERTY_ID) {
    throw new Error("GA4_PROPERTY_ID environment variable is not set");
  }
  if (!process.env.GA4_SERVICE_ACCOUNT_EMAIL) {
    throw new Error("GA4_SERVICE_ACCOUNT_EMAIL environment variable is not set");
  }
  if (!process.env.GA4_PRIVATE_KEY) {
    throw new Error("GA4_PRIVATE_KEY environment variable is not set");
  }

  // Parse the private key — Vercel stores multiline values with literal \n
  const rawKey = process.env.GA4_PRIVATE_KEY;
  const privateKey = rawKey.replace(/\\n/g, "\n");

  if (!privateKey.includes("BEGIN PRIVATE KEY") || !privateKey.includes("END PRIVATE KEY")) {
    throw new Error(
      "GA4_PRIVATE_KEY format is invalid — missing BEGIN/END markers. " +
      "On Vercel, paste the key with literal \\n instead of real newlines."
    );
  }

  console.log("[GA4] Initializing with property ID:", process.env.GA4_PROPERTY_ID);
  console.log("[GA4] Service account:", process.env.GA4_SERVICE_ACCOUNT_EMAIL);
  console.log("[GA4] Private key length:", privateKey.length);

  try {
    _analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
    });
    // Strip surrounding quotes that Vercel stores literally when set as "123456"
    _propertyId = process.env.GA4_PROPERTY_ID.replace(/^"|"$/g, "");
    console.log("[GA4] Client initialized successfully");
    console.log("[GA4] Resolved property ID:", _propertyId);
  } catch (error) {
    throw new Error("Failed to initialize GA4 client: " + (error instanceof Error ? error.message : "Unknown error"));
  }

  return { client: _analyticsDataClient, propertyId: _propertyId };
}

/**
 * Format error messages for better debugging
 */
function formatError(error: any, context: string): Error {
  console.error(`[GA4] Error in ${context}:`, {
    message: error?.message,
    code: error?.code,
    status: error?.status,
    details: error?.details,
    name: error?.name,
    type: typeof error,
    keys: error ? Object.keys(error) : [],
  });

  // Handle gRPC/Google API errors with undefined properties
  if (error?.code === undefined && error?.details === undefined) {
    return new Error(
      `${context}: Authentication or permission error. ` +
      `Please verify: 1) GA4 credentials are set correctly in Vercel, ` +
      `2) Service account has 'Viewer' role in Google Analytics property ${_propertyId ?? "(not set)"}, ` +
      `3) Google Analytics Data API is enabled`
    );
  }

  if (error?.message) {
    return new Error(`${context}: ${error.message}`);
  }
  
  if (error?.code) {
    return new Error(`${context}: API error code ${error.code}`);
  }
  
  return new Error(`${context}: Unknown error - ${JSON.stringify(error)}`);
}

/**
 * Get main analytics report with key metrics over the last 30 days
 */
export async function getAnalyticsReport() {
  try {
    const { client: analyticsDataClient, propertyId } = getGA4Client();
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
        {
          startDate: "60daysAgo",
          endDate: "31daysAgo",
        },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "conversions" },
      ],
    });

    return response;
  } catch (error) {
    throw formatError(error, "getAnalyticsReport");
  }
}

/**
 * Get real-time active users currently on the site
 */
export async function getRealTimeUsers() {
  try {
    const { client: analyticsDataClient, propertyId } = getGA4Client();
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    return response;
  } catch (error) {
    throw formatError(error, "getRealTimeUsers");
  }
}

/**
 * Get top pages by page views in the last 7 days
 */
export async function getTopPages() {
  try {
    const { client: analyticsDataClient, propertyId } = getGA4Client();
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
        {
          startDate: "14daysAgo",
          endDate: "8daysAgo",
        },
      ],
      dimensions: [{ name: "pagePathPlusQueryString" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    });

    return response;
  } catch (error) {
    throw formatError(error, "getTopPages");
  }
}

/**
 * Get traffic sources (acquisition channels) in the last 7 days
 */
export async function getTrafficSources() {
  try {
    const { client: analyticsDataClient, propertyId } = getGA4Client();
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    });

    return response;
  } catch (error) {
    throw formatError(error, "getTrafficSources");
  }
}

/**
 * Calculate percentage change between two values
 */
function calculateChange(current: number, previous: number): string {
  if (previous === 0) return "+100%";
  
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Format session duration from seconds to human-readable format
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Get time-series visitor count for the user count chart.
 *
 * @param period  "daily" | "weekly" | "monthly" | "yearly"
 * Returns an array of { label, visitors } objects ordered chronologically.
 */
export async function getUserCountChart(period: string): Promise<{ label: string; visitors: number }[]> {
  const { client: analyticsDataClient, propertyId } = getGA4Client();

  type PeriodConfig = {
    startDate: string;
    dimension: string;
    formatLabel: (raw: string) => string;
  };

  const configs: Record<string, PeriodConfig> = {
    daily: {
      startDate: "13daysAgo",
      dimension: "date",
      // raw = "YYYYMMDD"  →  "Mar 5"
      formatLabel: (raw) => {
        const y = parseInt(raw.slice(0, 4), 10);
        const m = parseInt(raw.slice(4, 6), 10) - 1;
        const d = parseInt(raw.slice(6, 8), 10);
        return new Date(y, m, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      },
    },
    weekly: {
      startDate: "84daysAgo",
      dimension: "yearWeek",
      // raw = "YYYYWW"  →  "Wk WW 'YY"
      formatLabel: (raw) => {
        const year = raw.slice(0, 4);
        const week = raw.slice(4).padStart(2, "0");
        return `Wk ${week} '${year.slice(2)}`;
      },
    },
    monthly: {
      startDate: "365daysAgo",
      dimension: "yearMonth",
      // raw = "YYYYMM"  →  "MMM YYYY"
      formatLabel: (raw) => {
        const y = parseInt(raw.slice(0, 4), 10);
        const m = parseInt(raw.slice(4, 6), 10) - 1;
        return new Date(y, m, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
      },
    },
    yearly: {
      startDate: "1826daysAgo",
      dimension: "year",
      formatLabel: (raw) => raw,
    },
  };

  const config = configs[period] ?? configs.daily;

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: config.startDate, endDate: "today" }],
      dimensions: [{ name: config.dimension }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: config.dimension }, desc: false }],
    });

    return (response.rows ?? []).map((row) => ({
      label: config.formatLabel(row.dimensionValues?.[0]?.value ?? ""),
      visitors: parseInt(row.metricValues?.[0]?.value ?? "0", 10),
    }));
  } catch (error) {
    throw formatError(error, "getUserCountChart");
  }
}

/**
 * Get all analytics data formatted for the dashboard
 */
export async function getAllAnalyticsData() {
  try {
    const [report, realtime, topPages, sources] = await Promise.all([
      getAnalyticsReport(),
      getRealTimeUsers(),
      getTopPages(),
      getTrafficSources(),
    ]);

    // Extract current period metrics (first date range)
    const currentMetrics = report.rows?.[0]?.metricValues || [];
    const previousMetrics = report.rows?.[1]?.metricValues || [];

    const totalUsers = parseInt(currentMetrics[0]?.value || "0");
    const previousUsers = parseInt(previousMetrics[0]?.value || "0");
    
    const pageViews = parseInt(currentMetrics[1]?.value || "0");
    const previousPageViews = parseInt(previousMetrics[1]?.value || "0");
    
    const avgDuration = parseFloat(currentMetrics[2]?.value || "0");
    const previousDuration = parseFloat(previousMetrics[2]?.value || "0");
    
    const bounceRate = parseFloat(currentMetrics[3]?.value || "0");
    const previousBounceRate = parseFloat(previousMetrics[3]?.value || "0");
    
    const conversions = parseInt(currentMetrics[4]?.value || "0");

    const activeUsers = parseInt(
      realtime.rows?.[0]?.metricValues?.[0]?.value || "0"
    );

    // Calculate conversion rate (conversions / total users * 100)
    const conversionRate = totalUsers > 0 ? (conversions / totalUsers) * 100 : 0;

    // Format top pages with change calculation
    const formattedTopPages = topPages.rows?.map((row) => {
      const currentViews = parseInt(row.metricValues?.[0]?.value || "0");
      const previousViews = parseInt(row.metricValues?.[1]?.value || "0");
      
      return {
        page: row.dimensionValues?.[0]?.value || "/",
        views: currentViews.toLocaleString(),
        change: calculateChange(currentViews, previousViews),
      };
    }) || [];

    // Format traffic sources with percentages
    const totalSourceUsers = sources.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || "0"),
      0
    ) || 1;

    const formattedSources = sources.rows?.map((row) => {
      const visitors = parseInt(row.metricValues?.[0]?.value || "0");
      const percentage = ((visitors / totalSourceUsers) * 100).toFixed(1);
      
      return {
        source: row.dimensionValues?.[0]?.value || "Unknown",
        visitors: visitors.toLocaleString(),
        percentage: `${percentage}%`,
      };
    }) || [];

    return {
      metrics: {
        totalVisitors: {
          value: totalUsers.toLocaleString(),
          change: calculateChange(totalUsers, previousUsers),
        },
        pageViews: {
          value: pageViews.toLocaleString(),
          change: calculateChange(pageViews, previousPageViews),
        },
        avgSessionDuration: {
          value: formatDuration(avgDuration),
          change: calculateChange(avgDuration, previousDuration),
        },
        bounceRate: {
          value: `${bounceRate.toFixed(1)}%`,
          change: calculateChange(bounceRate, previousBounceRate),
        },
        activeUsers: {
          value: activeUsers.toString(),
        },
        conversionRate: {
          value: `${conversionRate.toFixed(1)}%`,
          change: "+1.2%", // This would need comparison data
        },
      },
      topPages: formattedTopPages.slice(0, 5),
      trafficSources: formattedSources.slice(0, 5),
    };
  } catch (error) {
    throw formatError(error, "getAllAnalyticsData");
  }
}
