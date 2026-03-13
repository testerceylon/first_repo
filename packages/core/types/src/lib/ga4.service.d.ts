/**
 * Get main analytics report with key metrics over the last 30 days
 */
export declare function getAnalyticsReport(): Promise<import("@google-analytics/data/build/protos/protos").google.analytics.data.v1beta.IRunReportResponse>;
/**
 * Get real-time active users currently on the site
 */
export declare function getRealTimeUsers(): Promise<import("@google-analytics/data/build/protos/protos").google.analytics.data.v1beta.IRunRealtimeReportResponse>;
/**
 * Get top pages by page views in the last 7 days
 */
export declare function getTopPages(): Promise<import("@google-analytics/data/build/protos/protos").google.analytics.data.v1beta.IRunReportResponse>;
/**
 * Get traffic sources (acquisition channels) in the last 7 days
 */
export declare function getTrafficSources(): Promise<import("@google-analytics/data/build/protos/protos").google.analytics.data.v1beta.IRunReportResponse>;
/**
 * Get time-series visitor count for the user count chart.
 *
 * @param period  "daily" | "weekly" | "monthly" | "yearly"
 * Returns an array of { label, visitors } objects ordered chronologically.
 */
export declare function getUserCountChart(period: string): Promise<{
    label: string;
    visitors: number;
}[]>;
/**
 * Get all analytics data formatted for the dashboard
 */
export declare function getAllAnalyticsData(): Promise<{
    metrics: {
        totalVisitors: {
            value: string;
            change: string;
        };
        pageViews: {
            value: string;
            change: string;
        };
        avgSessionDuration: {
            value: string;
            change: string;
        };
        bounceRate: {
            value: string;
            change: string;
        };
        activeUsers: {
            value: string;
        };
        conversionRate: {
            value: string;
            change: string;
        };
    };
    topPages: {
        page: string;
        views: string;
        change: string;
    }[];
    trafficSources: {
        source: string;
        visitors: string;
        percentage: string;
    }[];
}>;
