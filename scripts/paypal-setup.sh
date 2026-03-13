#!/bin/bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PayPal Product & Plan Creator - Interactive Shell Script
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Usage: ./scripts/paypal-setup.sh
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 PayPal Product & Subscription Plan Creator"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Check if .env file exists
if [ ! -f .env ] && [ ! -f apps/api/.env ]; then
  echo -e "${RED}❌ Error: .env file not found${NC}"
  echo "Please create .env or apps/api/.env with your PayPal credentials"
  exit 1
fi

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
elif [ -f apps/api/.env ]; then
  export $(cat apps/api/.env | grep -v '^#' | xargs)
fi

# Prompt for credentials if not in .env
if [ -z "$PAYPAL_CLIENT_ID" ]; then
  echo -e "${YELLOW}Enter your PayPal Client ID:${NC}"
  read PAYPAL_CLIENT_ID
fi

if [ -z "$PAYPAL_CLIENT_SECRET" ]; then
  echo -e "${YELLOW}Enter your PayPal Client Secret:${NC}"
  read -s PAYPAL_CLIENT_SECRET
  echo ""
fi

# Determine environment
if [ "$NODE_ENV" = "production" ]; then
  BASE_URL="https://api-m.paypal.com"
  ENV_NAME="PRODUCTION"
  echo -e "${RED}⚠️  WARNING: Running in PRODUCTION mode${NC}"
else
  BASE_URL="https://api-m.sandbox.paypal.com"
  ENV_NAME="SANDBOX"
  echo -e "${BLUE}ℹ️  Running in SANDBOX mode${NC}"
fi

echo ""
echo "Environment: $ENV_NAME"
echo "API URL: $BASE_URL"
echo ""

# Confirm before proceeding
echo -e "${YELLOW}Ready to create Product and Plan. Continue? (y/n)${NC}"
read -r CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Aborted."
  exit 0
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 1: Get OAuth Access Token
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo "🔐 Step 1: Getting OAuth access token..."

TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/v1/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "$PAYPAL_CLIENT_ID:$PAYPAL_CLIENT_SECRET" \
  -d "grant_type=client_credentials")

# Check if request was successful
if echo "$TOKEN_RESPONSE" | grep -q "access_token"; then
  ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✅ Got access token: ${ACCESS_TOKEN:0:20}...${NC}"
else
  echo -e "${RED}❌ Failed to get access token${NC}"
  echo "Response: $TOKEN_RESPONSE"
  exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 2: Create Product
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
echo "📦 Step 2: Creating PayPal product..."

PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/v1/catalogs/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "Bunplate Pro Subscription",
    "description": "Get unlimited access to all Pro features including advanced image editing, unlimited QR codes, and priority support.",
    "type": "SERVICE",
    "category": "SOFTWARE",
    "image_url": "https://example.com/images/pro-badge.png",
    "home_url": "https://example.com"
  }')

# Check if product was created
if echo "$PRODUCT_RESPONSE" | grep -q '"id"'; then
  PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  PRODUCT_NAME=$(echo $PRODUCT_RESPONSE | grep -o '"name":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✅ Created Product:${NC}"
  echo "   ID: $PRODUCT_ID"
  echo "   Name: $PRODUCT_NAME"
else
  echo -e "${RED}❌ Failed to create product${NC}"
  echo "Response: $PRODUCT_RESPONSE"
  exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Step 3: Create Subscription Plan
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
echo "💳 Step 3: Creating subscription plan..."

PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/v1/billing/plans" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Prefer: return=representation" \
  -d '{
    "product_id": "'"$PRODUCT_ID"'",
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
  }')

# Check if plan was created
if echo "$PLAN_RESPONSE" | grep -q '"id":"P-'; then
  PLAN_ID=$(echo $PLAN_RESPONSE | grep -o '"id":"P-[^"]*' | cut -d'"' -f4)
  PLAN_NAME=$(echo $PLAN_RESPONSE | grep -o '"name":"[^"]*' | cut -d'"' -f4)
  PLAN_STATUS=$(echo $PLAN_RESPONSE | grep -o '"status":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✅ Created Subscription Plan:${NC}"
  echo "   ID: $PLAN_ID"
  echo "   Name: $PLAN_NAME"
  echo "   Status: $PLAN_STATUS"
else
  echo -e "${RED}❌ Failed to create plan${NC}"
  echo "Response: $PLAN_RESPONSE"
  exit 1
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Success! Display Results
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 SUCCESS! Add these to your .env file:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "PAYPAL_PRODUCT_ID=$PRODUCT_ID"
echo "PAYPAL_PLAN_PRO=$PLAN_ID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Next steps:"
echo "   1. Copy PAYPAL_PLAN_PRO to apps/api/.env"
echo "   2. Restart your API server"
echo "   3. Test at http://localhost:3000/billing"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Optional: Offer to append to .env
echo -e "${YELLOW}Would you like to append these to apps/api/.env? (y/n)${NC}"
read -r APPEND_ENV

if [ "$APPEND_ENV" = "y" ] || [ "$APPEND_ENV" = "Y" ]; then
  ENV_FILE="apps/api/.env"
  
  if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: $ENV_FILE not found${NC}"
    exit 1
  fi
  
  # Check if values already exist
  if grep -q "PAYPAL_PLAN_PRO" "$ENV_FILE"; then
    echo -e "${YELLOW}⚠️  PAYPAL_PLAN_PRO already exists in .env${NC}"
    echo "Please update it manually or remove the existing line first."
  else
    echo "" >> "$ENV_FILE"
    echo "# PayPal Plan IDs (Auto-generated)" >> "$ENV_FILE"
    echo "PAYPAL_PRODUCT_ID=$PRODUCT_ID" >> "$ENV_FILE"
    echo "PAYPAL_PLAN_PRO=$PLAN_ID" >> "$ENV_FILE"
    echo -e "${GREEN}✅ Added to $ENV_FILE${NC}"
  fi
fi

echo ""
echo -e "${GREEN}Done!${NC}"
