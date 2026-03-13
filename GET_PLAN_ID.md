# 🚀 Quick Guide: Get Your PayPal Plan ID

You need to obtain a **Plan ID** to add to your `.env` file as `PAYPAL_PLAN_PRO`.

## Prerequisites

1. ✅ PayPal Developer account created
2. ✅ Sandbox app created
3. ✅ `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` added to `apps/api/.env`

## Choose Your Method

### 🌟 Method 1: Automated TypeScript Script (EASIEST)

**Perfect if:** You already have credentials in your `.env` file

```bash
bun run scripts/create-paypal-plan.ts
```

**What it does:**
- ✅ Reads credentials from your `.env`
- ✅ Authenticates with PayPal
- ✅ Creates a Product
- ✅ Creates a Monthly Subscription Plan ($9.99)
- ✅ Outputs formatted variables to copy-paste

**Expected output:**
```
✅ Product created!
   Product ID: PROD-xxxxxxxxxxxx

✅ Subscription Plan created!
   Plan ID: P-xxxxxxxxxxxx

📋 Add these to your apps/api/.env:

PAYPAL_PRODUCT_ID=PROD-xxxxxxxxxxxx
PAYPAL_PLAN_PRO=P-xxxxxxxxxxxx
```

Just copy the `PAYPAL_PLAN_PRO` line to your `.env` file!

---

### 🔧 Method 2: Interactive Shell Script

**Perfect if:** You prefer guided setup with prompts

```bash
./scripts/paypal-setup.sh
```

**What it does:**
- ✅ Prompts you for credentials (or reads from `.env`)
- ✅ Creates Product & Plan with progress indicators
- ✅ Optionally appends variables to your `.env` automatically

**Interactive flow:**
```
🔐 Enter PayPal Client ID: [prompts if not found]
🔐 Enter PayPal Client Secret: [prompts if not found]

✓ Authenticating...
✓ Creating Product...
✓ Creating Subscription Plan...

✅ Success!
   PAYPAL_PLAN_PRO=P-xxxxxxxxxxxx

💡 Would you like to add this to apps/api/.env? (y/n)
```

---

### 📖 Method 3: Manual REST API (Most Control)

**Perfect if:** You want to customize the plan details or learn the API

1. Open **[PAYPAL_API_GUIDE.md](PAYPAL_API_GUIDE.md)**
2. Follow Step 1: Get OAuth Token
3. Follow Step 2: Create Product
4. Follow Step 3: Create Subscription Plan
5. Extract Plan ID from response JSON

**Example curl commands provided in guide:**
```bash
# 1. Get access token
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials"

# 2. Create product (guide has full JSON)
# 3. Create plan (guide has full JSON)
```

The guide includes:
- ✅ Complete JSON request/response examples
- ✅ Exact location of IDs in responses
- ✅ Troubleshooting section
- ✅ Bash script template

---

### 🖱️ Method 4: PayPal Dashboard (Manual GUI)

**Perfect if:** You prefer using the web interface

1. Open **[PAYPAL_SETUP.md](PAYPAL_SETUP.md)**
2. Go to **Section 3: Create Subscription Plans**
3. Follow step-by-step screenshots
4. Copy Plan ID from dashboard

**Steps:**
1. Log in to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Navigate to: Apps & Credentials → Your App → Features → Subscriptions
3. Create a new Product
4. Add a Monthly Plan ($9.99)
5. Copy the Plan ID (starts with `P-`)

---

## After Getting Your Plan ID

1. **Add to `.env`:**
   ```env
   PAYPAL_PLAN_PRO=P-xxxxxxxxxxxx
   ```

2. **Run database migration:**
   ```bash
   cd packages/core
   bun drizzle-kit migrate
   ```

3. **Set up webhook** (see [PAYPAL_SETUP.md](PAYPAL_SETUP.md) Section 4)

4. **Test subscription flow:**
   ```bash
   # Start servers
   cd apps/api && bun run dev
   cd apps/web && bun run dev
   
   # Visit http://localhost:3000/billing
   ```

---

## Troubleshooting

### "AUTHENTICATION_FAILURE"
- ❌ Wrong Client ID or Secret
- ✅ Double-check credentials in [PayPal Dashboard](https://developer.paypal.com/)
- ✅ Make sure you're using **Sandbox** credentials (not Live)

### "Script not found" error
```bash
# Make sure you're in the project root
cd /home/mahesh/Desktop/Projects_001/nextjs-multiworker
bun run scripts/create-paypal-plan.ts
```

### "Permission denied" for bash script
```bash
chmod +x scripts/paypal-setup.sh
./scripts/paypal-setup.sh
```

### Plan ID starts with wrong prefix
- ❌ Plan IDs should start with `P-` (not `PROD-`)
- ✅ Use the **Plan ID** from Step 3 (not the Product ID from Step 2)

---

## Quick Reference

| Method | Time | Difficulty | Automation |
|--------|------|------------|------------|
| TypeScript Script | 30 sec | Easy | Full |
| Shell Script | 1 min | Easy | Interactive |
| REST API (curl) | 5 min | Medium | Manual |
| Dashboard GUI | 5 min | Easy | Manual |

**Recommended:** Start with **Method 1** (TypeScript Script) for the fastest experience.

---

## Need Help?

See detailed guides:
- **[PAYPAL_API_GUIDE.md](PAYPAL_API_GUIDE.md)** - Complete REST API reference
- **[PAYPAL_SETUP.md](PAYPAL_SETUP.md)** - Dashboard setup guide
- **[scripts/README.md](scripts/README.md)** - Script documentation
- **[QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)** - Full setup checklist
