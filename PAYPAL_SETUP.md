# PayPal Subscription Integration Guide

Complete PayPal monthly subscription implementation for your Bunplate monorepo.

## 📋 Features Implemented

- ✅ Monthly Pro subscription ($9.99/month)
- ✅ Free Basic plan (default)
- ✅ PayPal subscription creation & approval flow
- ✅ Webhook verification and event handling
- ✅ Subscription cancellation
- ✅ Database schema with subscription fields
- ✅ Middleware to protect Pro features
- ✅ Frontend subscription management UI
- ✅ Success/Cancel redirect pages

---

## 🗄️ Database Changes

### Migration Required

The `users` table has been updated with subscription fields. Run the migration:

```bash
cd packages/core
bun drizzle-kit generate
bun drizzle-kit migrate
```

**New fields added to `users` table:**
- `plan` - enum: "basic" | "pro" | "premium" (default: "basic")
- `subscription_id` - PayPal subscription ID
- `subscription_status` - enum: "active" | "cancelled" | "expired"
- `subscription_current_period_end` - timestamp

---

## 🔐 PayPal Setup

### 1. Create PayPal Business Account
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create a Business account (or use existing)

### 2. Create Sandbox App
1. Go to **Dashboard → My Apps & Credentials**
2. Switch to **Sandbox** mode
3. Click **Create App**
4. Select **Merchant** as app type
5. Copy **Client ID** and **Secret**

### 3. Create Subscription Plans

**Option A: Using the Dashboard (Manual)**
1. Go to **Products & Services → Subscriptions**
2. Create a new plan:
   - **Product name**: Pro Subscription
   - **Billing cycle**: Monthly
   - **Price**: $9.99 USD
3. Copy the **Plan ID** (starts with `P-`)

**Option B: Using REST API (Recommended)** ⭐

Run the automated script:
```bash
# Make sure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are in .env
bun run scripts/create-paypal-plan.ts
```

Or follow the detailed guide: **[PAYPAL_API_GUIDE.md](PAYPAL_API_GUIDE.md)**

This will automatically create both the Product and Plan, and give you the IDs to add to your `.env` file.

### 4. Set Up Webhooks
1. Go to **My Apps & Credentials → [Your App]**
2. Scroll to **Webhooks**
3. Click **Add Webhook**
4. **Webhook URL**: `https://your-api-domain.com/billing/webhook`
5. **Event types** (select these):
   - ✅ `BILLING.SUBSCRIPTION.ACTIVATED`
   - ✅ `BILLING.SUBSCRIPTION.CANCELLED`
   - ✅ `BILLING.SUBSCRIPTION.EXPIRED`
   - ✅ `PAYMENT.SALE.COMPLETED`
6. Copy the **Webhook ID**

---

## ⚙️ Environment Variables

### Backend (`apps/api/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/bunplate
BETTER_AUTH_SECRET=your-secret-key

# PayPal Configuration
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
PAYPAL_WEBHOOK_ID=YOUR_WEBHOOK_ID
PAYPAL_PLAN_PRO=P-YOUR_PRO_PLAN_ID
PAYPAL_PLAN_PREMIUM=P-YOUR_PREMIUM_PLAN_ID  # Optional for now

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000

# In production, use live mode
NODE_ENV=production  # Uses live PayPal API
```

### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

---

## 🚀 Usage

### Protecting Routes with Subscription Middleware

In your API routes (`apps/api/src/routes/*.route.ts`), add the middleware:

```typescript
import { requireProSubscription } from "@/middlewares/subscription.middleware";

export const protectedRoute = createRoute({
  tags: ["Protected"],
  path: "/pro-feature",
  method: "post",
  middleware: [authMiddleware, requireProSubscription],
  // ... rest of route
});
```

Or use flexible plan requirements:

```typescript
import { requirePlan } from "@/middlewares/subscription.middleware";

export const premiumRoute = createRoute({
  middleware: [authMiddleware, requirePlan(["pro", "premium"])],
  // ... rest of route
});
```

### Frontend: Upgrade Button

Use the reusable upgrade button:

```tsx
import UpgradeButton from "@/components/upgrade-button";

<UpgradeButton variant="default" size="sm" />
```

### Subscription Flow

1. User clicks **"Upgrade to Pro"** button
2. Frontend calls `POST /billing/create-subscription`
3. User redirected to PayPal approval page
4. User approves subscription
5. PayPal redirects to `/billing/success?subscription_id=XXX`
6. Webhook activates subscription in database
7. User has Pro access

---

## 🧪 Testing in Sandbox

### Test User Accounts
1. Go to [PayPal Sandbox](https://developer.paypal.com/dashboard/accounts)
2. Create **Personal** test account (buyer)
3. Note the email & password

### Test Flow
1. Start your app in dev mode
2. Go to `/billing`
3. Click **Upgrade to Pro**
4. Log in with sandbox **Personal** account
5. Approve the subscription
6. Check webhook logs in API console
7. Verify database updated

### Sandbox Test Credit Cards (Personal Account)
PayPal sandbox uses real email/password of test accounts. No cards needed.

---

## 📂 Files Created/Modified

### Backend
- `packages/core/src/database/schema/auth.schema.ts` - Added subscription fields
- `apps/api/src/lib/paypal.service.ts` - PayPal API service
- `apps/api/src/handlers/billing.handlers.ts` - Billing handlers
- `apps/api/src/routes/billing.route.ts` - Billing routes
- `apps/api/src/registry/billing.registry.ts` - Route registry
- `apps/api/src/middlewares/subscription.middleware.ts` - Protection middleware

### Frontend
- `apps/web/src/components/subscription-plans.tsx` - Pricing cards
- `apps/web/src/components/upgrade-button.tsx` - Reusable button
- `apps/web/src/app/billing/page.tsx` - Billing page
- `apps/web/src/app/billing/success/page.tsx` - Success page
- `apps/web/src/app/billing/cancel/page.tsx` - Cancel page
- `apps/web/src/app/page.tsx` - Added billing link

---

## 🔄 Webhook Events

The webhook handler processes:

| Event | Action |
|-------|--------|
| `BILLING.SUBSCRIPTION.ACTIVATED` | Set plan to Pro, status to active |
| `BILLING.SUBSCRIPTION.CANCELLED` | Set plan to Basic, status to cancelled |
| `BILLING.SUBSCRIPTION.EXPIRED` | Set plan to Basic, status to expired |
| `PAYMENT.SALE.COMPLETED` | Extend subscription period |

---

## 🧪 Example: Sandbox Testing Script

```bash
# 1. Start API
cd apps/api
bun run dev

# 2. Start Web
cd apps/web
bun run dev

# 3. Visit http://localhost:3000/billing

# 4. Click "Upgrade to Pro"

# 5. Use PayPal sandbox credentials:
#    Email: your-sandbox-email@personal.example.com
#    Password: your-sandbox-password

# 6. Approve subscription

# 7. Check webhook logs in API terminal
```

---

## 🎯 Production Deployment

1. **Set environment to production**:
   ```env
   NODE_ENV=production
   ```

2. **Use live PayPal credentials**:
   - Switch to **Live** in PayPal Dashboard
   - Create live app & get credentials
   - Create live subscription plans
   - Create live webhook

3. **Update webhook URL**:
   ```
   https://your-api.com/billing/webhook
   ```

4. **Test with real PayPal account** (small amount first)

---

## 🛡️ Security Notes

- ✅ Webhook signature verification implemented
- ✅ User authentication required for all billing routes
- ✅ PayPal OAuth2 tokens refreshed automatically
- ✅ Subscription status validated on protected routes
- ✅ Environment variables kept secret

---

## 📖 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/billing/create-subscription` | ✅ | Create PayPal subscription |
| GET | `/billing/subscription` | ✅ | Get user's subscription |
| POST | `/billing/cancel-subscription` | ✅ | Cancel subscription |
| POST | `/billing/webhook` | ❌ | PayPal webhook handler |

---

## 🐛 Troubleshooting

### Webhook not working
- Check webhook URL is publicly accessible
- Verify PAYPAL_WEBHOOK_ID is correct
- Check event types are selected
- View webhook logs in PayPal Dashboard

### Subscription not activating
- Check webhook signature verification
- Look for errors in API console
- Verify email matches user in database
- Check PayPal event type is `BILLING.SUBSCRIPTION.ACTIVATED`

### "Invalid credentials" error
- Verify PAYPAL_CLIENT_ID and SECRET are correct
- Check if using sandbox vs production credentials
- Ensure no trailing spaces in .env file

---

## 🎉 Success!

Your PayPal subscription system is now fully operational. Users can:
- ✅ View subscription plans at `/billing`
- ✅ Upgrade to Pro with PayPal
- ✅ Cancel subscriptions
- ✅ Access Pro-only features

---

**Need help?** Check PayPal's [Subscription API docs](https://developer.paypal.com/docs/subscriptions/)
