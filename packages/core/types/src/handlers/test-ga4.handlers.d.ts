import { Context } from "hono";
/**
 * Test GA4 credentials and permissions
 * GET /api/admin/test-ga4
 */
export declare function testGA4Credentials(c: Context): Promise<Response & import("hono").TypedResponse<any, 200 | 500, "json">>;
