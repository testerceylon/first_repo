# Google Analytics Admin Dashboard Integration

## Overview

The admin dashboard now includes a dedicated **Analytics** tab that provides insights into website traffic, user behavior, and performance metrics powered by Google Analytics 4 (GA4).

## Features

### ✅ What's Included

1. **Analytics Navigation Tab** - New "Analytics" menu item in admin sidebar
2. **Metrics Dashboard** - Key performance indicators at a glance:
   - Total Visitors
   - Page Views
   - Average Session Duration
   - Bounce Rate
   - Active Users (Real-time)
   - Conversion Rate

3. **Multiple Views**:
   - **Overview** - Quick summary with top pages and traffic sources
   - **Real-time** - See active users currently on your site
   - **Reports** - Quick access to all Google Analytics reports

4. **Direct Links** - One-click access to full Google Analytics dashboard

## Current Implementation

### Static Demo Data

The current implementation displays **sample/demo data** for development and preview purposes. This allows you to see the dashboard layout and design without requiring API credentials.

### Direct GA Links

All buttons and report cards link directly to your Google Analytics dashboard, allowing you to view actual data in the full GA4 interface.

## 🚀 How to Get Real Data (Optional Enhancement)

To display **actual analytics data** in the admin dashboard instead of placeholder data, you can integrate with the Google Analytics Data API (GA4).

### Option 1: Google Analytics Data API (Recommended)

The Google Analytics Data API allows you to programmatically fetch metrics and display them in your dashboard.

#### Step 1: Enable Google Analytics Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Enable the **Google Analytics Data API**
4. Go to **APIs & Services** → **Credentials**
5. Create a **Service Account**
6. Download the JSON key file

#### Step 2: Grant Service Account Access

1. Open [Google Analytics](https://analytics.google.com/)
2. Go to **Admin** → **Property** → **Property Access Management**
3. Click **Add users**
4. Add your service account email (from the JSON file)
5. Grant **Viewer** permissions

#### Step 3: Add Environment Variables

Add to `apps/api/.env`:

```bash
# Google Analytics Data API
GA4_PROPERTY_ID="YOUR_PROPERTY_ID"  # e.g., "123456789"
GA4_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

To find your Property ID:
- Go to Google Analytics
- Admin → Property Settings
- Copy the Property ID (numeric value)

#### Step 4: Install Dependencies

```bash
cd apps/api
bun add @google-analytics/data
```

#### Step 5: Create Analytics Service

Create `apps/api/src/lib/ga4.service.ts`:

```typescript
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA4_PROPERTY_ID!;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function getAnalyticsReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: "30daysAgo",
        endDate: "today",
      },
    ],
    dimensions: [
      {
        name: "date",
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
}

export async function getRealTimeUsers() {
  const [response] = await analyticsDataClient.runRealtimeReport({
    property: `properties/${propertyId}`,
    metrics: [{ name: "activeUsers" }],
  });

  return response;
}

export async function getTopPages() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });

  return response;
}

export async function getTrafficSources() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
  });

  return response;
}
```

#### Step 6: Create API Endpoint

Create `apps/api/src/handlers/analytics.handlers.ts`:

```typescript
import { Context } from "hono";
import {
  getAnalyticsReport,
  getRealTimeUsers,
  getTopPages,
  getTrafficSources,
} from "../lib/ga4.service";

export async function getAnalyticsData(c: Context) {
  try {
    const [report, realtime, topPages, sources] = await Promise.all([
      getAnalyticsReport(),
      getRealTimeUsers(),
      getTopPages(),
      getTrafficSources(),
    ]);

    return c.json({
      metrics: {
        totalUsers: report.rows?.[0]?.metricValues?.[0]?.value || "0",
        pageViews: report.rows?.[0]?.metricValues?.[1]?.value || "0",
        avgSessionDuration: report.rows?.[0]?.metricValues?.[2]?.value || "0",
        bounceRate: report.rows?.[0]?.metricValues?.[3]?.value || "0",
        activeUsers: realtime.rows?.[0]?.metricValues?.[0]?.value || "0",
        conversions: report.rows?.[0]?.metricValues?.[4]?.value || "0",
      },
      topPages: topPages.rows?.map((row) => ({
        page: row.dimensionValues?.[0]?.value,
        views: row.metricValues?.[0]?.value,
      })),
      trafficSources: sources.rows?.map((row) => ({
        source: row.dimensionValues?.[0]?.value,
        visitors: row.metricValues?.[0]?.value,
      })),
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return c.json({ error: "Failed to fetch analytics data" }, 500);
  }
}
```

#### Step 7: Register Route

In `apps/api/src/routes/admin.route.ts`, add:

```typescript
import { getAnalyticsData } from "../handlers/analytics.handlers";

// Add to your admin routes
adminRoute.get("/analytics/data", adminMiddleware, getAnalyticsData);
```

#### Step 8: Update Frontend

Update `apps/web/src/app/admin/analytics/page.tsx` to fetch real data:

```typescript
const [metrics, setMetrics] = useState<any>(null);

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const res = await fetch(`${base}/api/admin/analytics/data`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, []);
```

### Option 2: Google Analytics Embed API (More Complex)

The Embed API allows you to embed Google Analytics reports directly in your admin panel with interactive charts. This requires OAuth 2.0 authentication and more complex setup.

[Learn more about Google Analytics Embed API](https://developers.google.com/analytics/devguides/reporting/embed/v1)

### Option 3: Keep Current Implementation (Simplest)

The current implementation provides:
- Clean, professional UI for analytics overview
- Direct links to full Google Analytics dashboard
- Demo data for UI/UX preview
- Zero additional API costs or complexity

For most use cases, clicking through to the full GA dashboard is sufficient and recommended.

## 📊 Available Reports

The Analytics tab provides quick access to:

1. **Overview Dashboard** - Key metrics and trends
2. **Real-time Report** - Current active users
3. **Audience Report** - Demographics and interests
4. **Acquisition Report** - Traffic sources and campaigns
5. **Behavior Report** - Content performance and user flow
6. **Conversions Report** - Goal completions and events
7. **Events Report** - Custom event tracking

## 🎯 Usage

### Accessing Analytics Dashboard

1. Log in as an **admin user**
2. Navigate to **Admin** → **Analytics**
3. View metrics overview or click **Reports** tab
4. Click any report card to open in Google Analytics

### Understanding Metrics

- **Total Visitors** - Unique users who visited your site
- **Page Views** - Total number of pages viewed
- **Avg. Session Duration** - Average time users spend on site
- **Bounce Rate** - % of single-page sessions
- **Active Users** - Users currently on your site (real-time)
- **Conversion Rate** - % of sessions with goal completions

### Real-time Monitoring

Click the **Real-time** tab to see:
- Number of active users right now
- What pages they're viewing
- Where they're coming from
- What devices they're using

## 🔒 Security Notes

- Analytics dashboard is **admin-only** (protected by admin middleware)
- Service account credentials should be stored securely in environment variables
- Never commit the service account JSON file to version control
- Grant minimum required permissions (Viewer role) to service account

## 📚 Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Analytics Data API Node.js Client](https://github.com/googleapis/google-cloud-node/tree/main/packages/google-analytics-data)
- [GA4 Dimensions & Metrics Reference](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)

## 🎨 Customization

To customize the analytics dashboard:

1. **Add More Metrics** - Edit the `metrics` array in `page.tsx`
2. **Change Date Ranges** - Modify `dateRanges` in API calls
3. **Custom Visualizations** - Add chart libraries like Recharts or Chart.js
4. **Export Reports** - Add CSV/PDF export functionality
5. **Scheduled Reports** - Set up automated email reports

## Support

For issues with Google Analytics integration:
1. Verify GA4 is properly configured and collecting data
2. Check that NEXT_PUBLIC_GA_ID is set correctly
3. Ensure admin user has proper permissions
4. Review browser console for GA script loading errors

For issues with the Data API:
1. Verify service account has proper GA4 access
2. Check that environment variables are set correctly
3. Test API connection in Google Cloud Console
4. Review API quota and usage limits
