# PayPal Setup Scripts

Automated scripts to help you set up PayPal subscriptions for your SaaS.

---

## 📜 Available Scripts

### `create-paypal-plan.ts`

Automatically creates a PayPal Product and Subscription Plan using the REST API.

**What it does:**
1. ✅ Gets OAuth access token from PayPal
2. ✅ Creates a Product (type: SERVICE, category: SOFTWARE)
3. ✅ Creates a Monthly Subscription Plan ($9.99/month)
4. ✅ Returns Product ID and Plan ID to add to your .env

**Prerequisites:**
- PayPal Business account
- Sandbox app created in PayPal Developer Dashboard
- `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in your `.env` file

**Usage:**

```bash
# Run from project root
bun run scripts/create-paypal-plan.ts
```

**Example Output:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PayPal Product & Plan Creator
   Mode: SANDBOX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Step 1: Getting OAuth access token...
✅ Got access token: A21AAL1234567890abcd...

📦 Step 2: Creating PayPal product...
✅ Created Product:
   ID: PROD-12A34567B8901234
   Name: Bunplate Pro Subscription

💳 Step 3: Creating subscription plan...
✅ Created Subscription Plan:
   ID: P-12A34567B8901234567890ABC
   Name: Bunplate Pro - Monthly
   Status: ACTIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUCCESS! Add these to your .env file:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYPAL_PRODUCT_ID=PROD-12A34567B8901234
PAYPAL_PLAN_PRO=P-12A34567B8901234567890ABC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Next Steps:**

1. Copy the `PAYPAL_PLAN_PRO` value
2. Add it to `apps/api/.env`
3. Restart your API server
4. Test at `http://localhost:3000/billing`

---

## 🔧 Configuration

Edit the script to customize:

```typescript
const config = {
  product: {
    name: "Your Product Name",
    description: "Your product description",
    // ...
  },
  plan: {
    name: "Your Plan Name",
    price: "9.99",  // Change price here
    currency: "USD",
  },
};
```

---

## 🌍 Production Mode

To create plans in production (live mode):

```bash
NODE_ENV=production bun run scripts/create-paypal-plan.ts
```

**Important:** Make sure you have **live** credentials in your `.env`:
- Live `PAYPAL_CLIENT_ID`
- Live `PAYPAL_CLIENT_SECRET`

---

## 🐛 Troubleshooting

### "Missing PayPal credentials"
- ✅ Check `PAYPAL_CLIENT_ID` is in .env
- ✅ Check `PAYPAL_CLIENT_SECRET` is in .env
- ✅ No trailing spaces or quotes

### "Failed to get access token"
- ✅ Verify credentials are correct in PayPal Dashboard
- ✅ Check you're using sandbox credentials for sandbox mode
- ✅ Ensure app is in "Merchant" mode

### "Failed to create product"
- ✅ Check if you have permission to create products
- ✅ Verify app has "Subscriptions" feature enabled
- ✅ Check API response for specific error

---

## 📖 Documentation

For detailed API documentation and manual setup:
- **[PAYPAL_API_GUIDE.md](../PAYPAL_API_GUIDE.md)** - Complete REST API reference
- **[PAYPAL_SETUP.md](../PAYPAL_SETUP.md)** - Full setup guide
- **[QUICK_START_CHECKLIST.md](../QUICK_START_CHECKLIST.md)** - Step-by-step checklist

---

## 💡 Tips

- **Save the Product ID** for reference, even though you only need Plan ID in .env
- **Test in sandbox first** - Always verify with test accounts before going live
- **Keep IDs safe** - Don't commit Plan IDs to git if they're production values
- **One plan per product** - You can create multiple plans for the same product (monthly, yearly, etc.)

---

## 🎯 Multiple Plans

To create additional plans (e.g., yearly):

1. Reuse the same Product ID
2. Modify the billing cycle in the script:

```typescript
billing_cycles: [
  {
    frequency: {
      interval_unit: "YEAR",  // Changed from MONTH
      interval_count: 1,
    },
    // ... rest of config
    pricing_scheme: {
      fixed_price: {
        value: "99.99",  // Yearly price
        currency_code: "USD",
      },
    },
  },
]
```

3. Save as `PAYPAL_PLAN_YEARLY` in .env

---

**Need help?** Open an issue or check the PayPal Developer documentation.
