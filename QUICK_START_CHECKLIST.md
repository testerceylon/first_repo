# 🚀 Quick Start Checklist

Complete this checklist to get your PayPal subscription system running.

---

## ✅ Step-by-Step Setup

### 1. Database Migration
```bash
cd packages/core
bun drizzle-kit migrate
```
- [ ] Migration completed successfully
- [ ] Verify `users` table has new subscription fields

---

### 2. PayPal Account Setup
Go to [PayPal Developer Dashboard](https://developer.paypal.com/)

#### Create Sandbox App
- [ ] Created Business sandbox account (or use existing)
- [ ] Created REST API app
- [ ] Selected "Merchant" type
- [ ] Copied **Client ID**
- [ ] Copied **Client Secret**

#### Create Subscription Plan

**Option A: Automated Script (Recommended)** ⭐

```bash
# Make sure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are in .env
bun run scripts/create-paypal-plan.ts
```

This will output:
```
PAYPAL_PRODUCT_ID=PROD-xxxxx
PAYPAL_PLAN_PRO=P-xxxxx
```

- [ ] Ran script successfully
- [ ] Copied **Plan ID** (starts with `P-`)

**Option B: Manual via Dashboard**
- [ ] Go to Products & Services → Subscriptions
- [ ] Created "Pro" subscription plan
- [ ] Set price to $9.99/month (or your price)
- [ ] Copied **Plan ID** (starts with `P-`)

**Option C: Manual via REST API**
- [ ] Follow [PAYPAL_API_GUIDE.md](PAYPAL_API_GUIDE.md) for curl commands

#### Set Up Webhook
- [ ] Go to My Apps → [Your App] → Webhooks
- [ ] Added webhook URL: `https://your-domain.com/api/billing/webhook`
- [ ] Selected events:
  - [ ] `BILLING.SUBSCRIPTION.ACTIVATED`
  - [ ] `BILLING.SUBSCRIPTION.CANCELLED`
  - [ ] `BILLING.SUBSCRIPTION.EXPIRED`
  - [ ] `PAYMENT.SALE.COMPLETED`
- [ ] Copied **Webhook ID**

---

### 3. Environment Variables

#### Backend (`apps/api/.env`)
```env
# Existing vars
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...

# Add these PayPal vars
PAYPAL_CLIENT_ID=YOUR_CLIENT_ID_HERE
PAYPAL_CLIENT_SECRET=YOUR_SECRET_HERE
PAYPAL_WEBHOOK_ID=YOUR_WEBHOOK_ID_HERE
PAYPAL_PLAN_PRO=P-YOUR_PLAN_ID_HERE
FRONTEND_URL=http://localhost:3000
```

- [ ] Added all PayPal environment variables
- [ ] Verified no trailing spaces
- [ ] Saved file

#### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

- [ ] Verified backend URL is correct
- [ ] Saved file

---

### 4. Test Locally

#### Start Services
```bash
# Terminal 1: API
cd apps/api
bun run dev

# Terminal 2: Web
cd apps/web  
bun run dev
```

- [ ] API running on http://localhost:3001
- [ ] Web running on http://localhost:3000
- [ ] No TypeScript errors

#### Test Flow
1. [ ] Visit http://localhost:3000/billing
2. [ ] See pricing plans displayed
3. [ ] Click "Upgrade to Pro"
4. [ ] Redirected to PayPal sandbox login
5. [ ] Log in with **Personal** sandbox test account
6. [ ] Approve subscription
7. [ ] Redirected to `/billing/success`
8. [ ] Check API console for webhook event
9. [ ] Verify database: `plan = "pro"`, `subscription_status = "active"`

---

### 5. Production Deployment

#### Switch to Live Mode
- [ ] Created **Live** PayPal app
- [ ] Created **Live** subscription plan
- [ ] Created **Live** webhook
- [ ] Updated environment variables with **Live** credentials
- [ ] Set `NODE_ENV=production`

#### Update Webhook URL
- [ ] Changed webhook to: `https://your-production-domain.com/api/billing/webhook`
- [ ] Webhook is publicly accessible
- [ ] SSL/HTTPS enabled

#### Test with Real Account
- [ ] Small test payment ($0.01 or similar)
- [ ] Webhook received and verified
- [ ] Database updated correctly
- [ ] User can access Pro features

---

## 🎯 Verification

After setup, verify these work:

### API Endpoints
- [ ] `POST /api/billing/create-subscription` - Returns approval URL
- [ ] `GET /api/billing/subscription` - Returns user's subscription
- [ ] `POST /api/billing/cancel-subscription` - Cancels subscription
- [ ] `POST /api/billing/webhook` - Processes webhook events

### Frontend Pages
- [ ] `/billing` - Shows pricing plans
- [ ] `/billing/success` - Shown after approval
- [ ] `/billing/cancel` - Shown if user cancels
- [ ] Home page has "View Plans & Billing" button

### Middleware
- [ ] Pro-only routes protected with `requireProSubscription`
- [ ] Basic users get 403 error with upgrade message
- [ ] Pro users can access protected routes

---

## 🐛 Common Issues

### "Invalid PayPal credentials"
- ✅ Check Client ID and Secret are correct
- ✅ Verify no extra spaces in .env
- ✅ Restart API server after changing .env

### "Webhook signature invalid"
- ✅ Webhook ID matches the webhook you created
- ✅ Webhook URL is publicly accessible
- ✅ Using correct environment (sandbox vs production)

### "Subscription not activated"
- ✅ Check API logs for webhook events
- ✅ User email must match database
- ✅ PayPal sent `BILLING.SUBSCRIPTION.ACTIVATED`

### RPC types not working
```bash
cd apps/api
bun run build:types
```

---

## 📝 Next Steps

Once everything works:

1. [ ] Read `PAYPAL_SETUP.md` for detailed docs
2. [ ] Check `SUBSCRIPTION_EXAMPLES.md` for code samples
3. [ ] Protect your Pro features with middleware
4. [ ] Add email notifications (optional)
5. [ ] Set up monitoring/logging
6. [ ] Test edge cases (payment failure, expired subscription)

---

## 🎉 Success Criteria

Your system is ready when:
- ✅ Users can upgrade to Pro via PayPal
- ✅ Webhooks update database correctly
- ✅ Pro features are protected
- ✅ Users can cancel subscriptions
- ✅ No TypeScript errors
- ✅ All tests pass in sandbox

---

**Need help?** Refer to:
- `IMPLEMENTATION_SUMMARY.md` - Overview of changes
- `PAYPAL_SETUP.md` - Detailed setup instructions
- `SUBSCRIPTION_EXAMPLES.md` - Code examples
- [PayPal Developer Docs](https://developer.paypal.com/docs/subscriptions/)
