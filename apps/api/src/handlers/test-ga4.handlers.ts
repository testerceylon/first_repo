import { Context } from "hono";

/**
 * Test GA4 credentials and permissions
 * GET /api/admin/test-ga4
 */
export async function testGA4Credentials(c: Context) {
  const results: any = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // Check 1: Environment variables
  results.checks.envVars = {
    GA4_PROPERTY_ID: !!process.env.GA4_PROPERTY_ID,
    GA4_SERVICE_ACCOUNT_EMAIL: !!process.env.GA4_SERVICE_ACCOUNT_EMAIL,
    GA4_PRIVATE_KEY: !!process.env.GA4_PRIVATE_KEY,
    propertyId: process.env.GA4_PROPERTY_ID,
    serviceAccount: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
    privateKeyLength: process.env.GA4_PRIVATE_KEY?.length || 0,
    privateKeyHasBegin: process.env.GA4_PRIVATE_KEY?.includes("BEGIN PRIVATE KEY") || false,
    privateKeyHasEnd: process.env.GA4_PRIVATE_KEY?.includes("END PRIVATE KEY") || false,
  };

  // Check 2: Try to initialize client
  try {
    const { BetaAnalyticsDataClient } = await import("@google-analytics/data");
    
    const privateKey = process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, "\n");
    
    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL!,
        private_key: privateKey,
      },
    });

    results.checks.clientInit = { success: true };

    // Check 3: Try a simple API call
    try {
      const [response] = await client.runReport({
        property: `properties/${process.env.GA4_PROPERTY_ID}`,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        metrics: [{ name: "activeUsers" }],
      });

      results.checks.apiCall = {
        success: true,
        hasData: !!response.rows,
        rowCount: response.rows?.length || 0,
      };
    } catch (error: any) {
      results.checks.apiCall = {
        success: false,
        error: {
          message: error?.message || "Unknown error",
          code: error?.code,
          status: error?.status,
          details: error?.details,
          name: error?.name,
        },
        suggestion: "Service account likely doesn't have 'Viewer' role in GA4 property or API is not enabled",
      };
    }
  } catch (error: any) {
    results.checks.clientInit = {
      success: false,
      error: error?.message || "Failed to initialize client",
    };
  }

  return c.json(results, results.checks.apiCall?.success ? 200 : 500);
}
