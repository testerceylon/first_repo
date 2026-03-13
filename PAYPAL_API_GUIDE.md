# PayPal Product & Subscription Plan Creation Guide

**Complete REST API guide for creating PayPal subscription products and plans in SANDBOX mode.**

---

## 📋 Prerequisites

You need:
- ✅ PayPal Business account
- ✅ `PAYPAL_CLIENT_ID` (from sandbox app)
- ✅ `PAYPAL_CLIENT_SECRET` (from sandbox app)

**Sandbox API Base URL**: `https://api-m.sandbox.paypal.com`

---

## 🔐 Step 1: Get OAuth Access Token

### Request

```bash
curl -v POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Accept: application/json" \
  -H "Accept-Language: en_US" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

### Example with actual credentials format:

```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "AeB1234567890abcdefghijklmnopqr:EDB0987654321zyxwvutsrqponmlk" \
  -d "grant_type=client_credentials"
```

### Response

```json
{
  "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/subscriptions ...",
  "access_token": "A21AAL1234567890abcdefghijklmnopqrstuvwxyz...",
  "token_type": "Bearer",
  "app_id": "APP-1234567890ABCDEF",
  "expires_in": 32400,
  "nonce": "2023-01-15T12:34:56Z..."
}
```

**📌 Save this `access_token` - you'll use it in the next steps.**

---

## 📦 Step 2: Create a Product

PayPal requires a Product before creating a Subscription Plan.

### Request

```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/catalogs/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Pro Subscription",
    "description": "Monthly Pro subscription with unlimited features",
    "type": "SERVICE",
    "category": "SOFTWARE",
    "image_url": "https://your-domain.com/pro-icon.png",
    "home_url": "https://your-domain.com"
  }'
```

### Full Example

```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/catalogs/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer A21AAL1234567890abcdefghijklmnopqrstuvwxyz" \
  -d '{
    "name": "Bunplate Pro Subscription",
    "description": "Get unlimited access to all Pro features including advanced image editing, unlimited QR codes, and priority support.",
    "type": "SERVICE",
    "category": "SOFTWARE",
    "image_url": "https://example.com/images/pro-badge.png",
    "home_url": "https://example.com"
  }'
```

### Response

```json
{
  "id": "PROD-12A34567B8901234",
  "name": "Bunplate Pro Subscription",
  "description": "Get unlimited access to all Pro features including advanced image editing, unlimited QR codes, and priority support.",
  "type": "SERVICE",
  "category": "SOFTWARE",
  "image_url": "https://example.com/images/pro-badge.png",
  "home_url": "https://example.com",
  "create_time": "2024-01-15T10:30:45Z",
  "update_time": "2024-01-15T10:30:45Z",
  "links": [
    {
      "href": "https://api-m.sandbox.paypal.com/v1/catalogs/products/PROD-12A34567B8901234",
      "rel": "self",
      "method": "GET"
    },
    {
      "href": "https://api-m.sandbox.paypal.com/v1/catalogs/products/PROD-12A34567B8901234",
      "rel": "edit",
      "method": "PATCH"
    }
  ]
}
```

**📌 Product ID Location**: `response.id = "PROD-12A34567B8901234"`

**✅ Save this Product ID - you need it for the next step!**

---

## 💳 Step 3: Create Monthly Subscription Plan

Now create the billing plan linked to your product.

### Request

```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Prefer: return=representation" \
  -d '{
    "product_id": "PROD-12A34567B8901234",
    "name": "Pro Monthly Plan",
    "description": "Pro subscription billed monthly at $9.99",
    "status": "ACTIVE",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "9.99",
            "currency_code": "USD"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee": {
        "value": "0",
        "currency_code": "USD"
      },
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    },
    "taxes": {
      "percentage": "0",
      "inclusive": false
    }
  }'
```

### Full Example

```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer A21AAL1234567890abcdefghijklmnopqrstuvwxyz" \
  -H "Prefer: return=representation" \
  -d '{
    "product_id": "PROD-12A34567B8901234",
    "name": "Bunplate Pro - Monthly",
    "description": "Monthly Pro subscription with unlimited features - $9.99/month",
    "status": "ACTIVE",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "9.99",
            "currency_code": "USD"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee": {
        "value": "0",
        "currency_code": "USD"
      },
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    },
    "taxes": {
      "percentage": "0",
      "inclusive": false
    }
  }'
```

### Response

```json
{
  "id": "P-12A34567B8901234567890ABC",
  "product_id": "PROD-12A34567B8901234",
  "name": "Bunplate Pro - Monthly",
  "description": "Monthly Pro subscription with unlimited features - $9.99/month",
  "status": "ACTIVE",
  "billing_cycles": [
    {
      "frequency": {
        "interval_unit": "MONTH",
        "interval_count": 1
      },
      "tenure_type": "REGULAR",
      "sequence": 1,
      "total_cycles": 0,
      "pricing_scheme": {
        "fixed_price": {
          "value": "9.99",
          "currency_code": "USD"
        }
      }
    }
  ],
  "payment_preferences": {
    "auto_bill_outstanding": true,
    "setup_fee": {
      "value": "0.00",
      "currency_code": "USD"
    },
    "setup_fee_failure_action": "CONTINUE",
    "payment_failure_threshold": 3
  },
  "taxes": {
    "percentage": "0.00",
    "inclusive": false
  },
  "create_time": "2024-01-15T10:45:30Z",
  "update_time": "2024-01-15T10:45:30Z",
  "links": [
    {
      "href": "https://api-m.sandbox.paypal.com/v1/billing/plans/P-12A34567B8901234567890ABC",
      "rel": "self",
      "method": "GET",
      "encType": "application/json"
    },
    {
      "href": "https://api-m.sandbox.paypal.com/v1/billing/plans/P-12A34567B8901234567890ABC",
      "rel": "edit",
      "method": "PATCH",
      "encType": "application/json"
    },
    {
      "href": "https://api-m.sandbox.paypal.com/v1/billing/plans/P-12A34567B8901234567890ABC/deactivate",
      "rel": "deactivate",
      "method": "POST",
      "encType": "application/json"
    }
  ]
}
```

**📌 Plan ID Location**: `response.id = "P-12A34567B8901234567890ABC"`

**✅ This is your `PAYPAL_PLAN_PRO` value!**

---

## 🔍 Important Fields Explained

### Billing Cycle Configuration

```json
{
  "frequency": {
    "interval_unit": "MONTH",    // MONTH, YEAR, WEEK, DAY
    "interval_count": 1           // Charge every 1 month
  },
  "tenure_type": "REGULAR",       // TRIAL or REGULAR
  "sequence": 1,                  // Order of billing cycles
  "total_cycles": 0               // 0 = infinite recurring
}
```

### Payment Preferences

```json
{
  "auto_bill_outstanding": true,         // Auto-retry failed payments
  "payment_failure_threshold": 3         // Cancel after 3 failures
}
```

### Price Configuration

```json
{
  "fixed_price": {
    "value": "9.99",              // Amount
    "currency_code": "USD"        // Currency
  }
}
```

---

## 📝 Complete Workflow Script

Save this as `create-paypal-plan.sh`:

```bash
#!/bin/bash

# Configuration
CLIENT_ID="YOUR_CLIENT_ID"
CLIENT_SECRET="YOUR_CLIENT_SECRET"
BASE_URL="https://api-m.sandbox.paypal.com"

echo "🔐 Step 1: Getting OAuth token..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/v1/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "$CLIENT_ID:$CLIENT_SECRET" \
  -d "grant_type=client_credentials")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Failed to get access token"
  echo $TOKEN_RESPONSE
  exit 1
fi

echo "✅ Got access token: ${ACCESS_TOKEN:0:20}..."

echo ""
echo "📦 Step 2: Creating Product..."
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/v1/catalogs/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "Bunplate Pro Subscription",
    "description": "Get unlimited access to all Pro features",
    "type": "SERVICE",
    "category": "SOFTWARE",
    "home_url": "https://example.com"
  }')

PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$PRODUCT_ID" ]; then
  echo "❌ Failed to create product"
  echo $PRODUCT_RESPONSE
  exit 1
fi

echo "✅ Created Product ID: $PRODUCT_ID"

echo ""
echo "💳 Step 3: Creating Subscription Plan..."
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/v1/billing/plans" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Prefer: return=representation" \
  -d '{
    "product_id": "'"$PRODUCT_ID"'",
    "name": "Bunplate Pro - Monthly",
    "description": "Monthly Pro subscription - $9.99/month",
    "status": "ACTIVE",
    "billing_cycles": [
      {
        "frequency": {
          "interval_unit": "MONTH",
          "interval_count": 1
        },
        "tenure_type": "REGULAR",
        "sequence": 1,
        "total_cycles": 0,
        "pricing_scheme": {
          "fixed_price": {
            "value": "9.99",
            "currency_code": "USD"
          }
        }
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee": {
        "value": "0",
        "currency_code": "USD"
      },
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    },
    "taxes": {
      "percentage": "0",
      "inclusive": false
    }
  }')

PLAN_ID=$(echo $PLAN_RESPONSE | grep -o '"id":"P-[^"]*' | cut -d'"' -f4)

if [ -z "$PLAN_ID" ]; then
  echo "❌ Failed to create plan"
  echo $PLAN_RESPONSE
  exit 1
fi

echo "✅ Created Plan ID: $PLAN_ID"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 SUCCESS! Add these to your .env file:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "PAYPAL_PRODUCT_ID=$PRODUCT_ID"
echo "PAYPAL_PLAN_PRO=$PLAN_ID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**Usage**:
```bash
chmod +x create-paypal-plan.sh
./create-paypal-plan.sh
```

---

## 🎯 Quick Test in Terminal

### One-liner to create everything:

```bash
# 1. Get token
TOKEN=$(curl -s -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -u "CLIENT_ID:CLIENT_SECRET" \
  -d "grant_type=client_credentials" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# 2. Create product
PROD=$(curl -s -X POST https://api-m.sandbox.paypal.com/v1/catalogs/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pro","type":"SERVICE","category":"SOFTWARE"}' | grep -o '"id":"[^"]*' | cut -d'"' -f4)

# 3. Create plan
PLAN=$(curl -s -X POST https://api-m.sandbox.paypal.com/v1/billing/plans \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"product_id":"'$PROD'","name":"Pro Monthly","status":"ACTIVE","billing_cycles":[{"frequency":{"interval_unit":"MONTH","interval_count":1},"tenure_type":"REGULAR","sequence":1,"total_cycles":0,"pricing_scheme":{"fixed_price":{"value":"9.99","currency_code":"USD"}}}],"payment_preferences":{"auto_bill_outstanding":true,"payment_failure_threshold":3}}' | grep -o '"id":"P-[^"]*' | cut -d'"' -f4)

echo "Product: $PROD"
echo "Plan: $PLAN"
```

---

## 🔍 Verify Your Plan

### Get Plan Details

```bash
curl -X GET "https://api-m.sandbox.paypal.com/v1/billing/plans/P-YOUR_PLAN_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### List All Products

```bash
curl -X GET "https://api-m.sandbox.paypal.com/v1/catalogs/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### List All Plans

```bash
curl -X GET "https://api-m.sandbox.paypal.com/v1/billing/plans" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📌 Where to Find IDs

After creating:

| Type | Where to find | Format | Example |
|------|---------------|--------|---------|
| **Product ID** | `response.id` | PROD-XXXX | `PROD-12A34567B8901234` |
| **Plan ID** | `response.id` | P-XXXX | `P-12A34567B8901234567890ABC` |
| **Access Token** | `response.access_token` | A21AAL... | `A21AAL1234567890abcdef...` |

---

## ⚙️ Add to Your .env File

After creation, add these to `apps/api/.env`:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=AeB1234567890abcdefghijklmnopqr
PAYPAL_CLIENT_SECRET=EDB0987654321zyxwvutsrqponmlk
PAYPAL_WEBHOOK_ID=WH-1A234567B8C901234D5E6F789G0H
PAYPAL_PLAN_PRO=P-12A34567B8901234567890ABC

# Optional: Save for reference
PAYPAL_PRODUCT_ID=PROD-12A34567B8901234
```

---

## 🚀 Production Deployment

When going live:

1. **Switch to Live API**:
   ```
   https://api-m.paypal.com  (remove "sandbox")
   ```

2. **Get Live Credentials**:
   - Switch to **Live** in PayPal Dashboard
   - Create new live app
   - Get live Client ID & Secret

3. **Create Live Product & Plan**:
   - Run the same API calls with live credentials
   - Get live Plan ID

4. **Update .env**:
   ```env
   NODE_ENV=production
   PAYPAL_CLIENT_ID=live_client_id
   PAYPAL_CLIENT_SECRET=live_secret
   PAYPAL_PLAN_PRO=P-live_plan_id
   ```

---

## 🐛 Common Issues

### "Authentication failed"
- ✅ Check Client ID and Secret are correct
- ✅ Use `-u` flag for basic auth in token request
- ✅ No spaces in credentials

### "Invalid product_id"
- ✅ Product must be created BEFORE plan
- ✅ Product ID format: `PROD-XXXX`
- ✅ Check product exists with GET request

### "total_cycles must be greater than 0"
- ✅ For infinite recurring, use `"total_cycles": 0` (not 1)
- ✅ PayPal treats 0 as unlimited

---

## 📖 API Documentation

- **Products API**: https://developer.paypal.com/docs/api/catalog-products/v1/
- **Billing Plans API**: https://developer.paypal.com/docs/api/subscriptions/v1/#plans
- **OAuth**: https://developer.paypal.com/api/rest/authentication/

---

## ✅ Success Checklist

After running all commands:

- [ ] Got access token successfully
- [ ] Created product with ID format `PROD-XXXX`
- [ ] Created plan with ID format `P-XXXX`
- [ ] Plan status is `ACTIVE`
- [ ] Added `PAYPAL_PLAN_PRO` to .env
- [ ] Restarted API server
- [ ] Tested subscription flow in app

---

**🎉 You're ready to accept subscriptions!**
