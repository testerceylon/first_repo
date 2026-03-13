/**
 * PayPal Product & Subscription Plan Creator
 * 
 * This script creates a PayPal product and monthly subscription plan
 * using the PayPal REST API in sandbox mode.
 * 
 * Usage:
 *   bun run scripts/create-paypal-plan.ts
 * 
 * Requirements:
 *   - PAYPAL_CLIENT_ID in .env
 *   - PAYPAL_CLIENT_SECRET in .env
 */

// Load environment variables from common .env locations (manual loader for Bun)
import fs from "fs";
import path from "path";

function parseEnv(content: string) {
  const lines = content.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    let key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = val;
    }
  }
}

function loadDotenvFiles() {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "apps/api/.env"),
    path.resolve(process.cwd(), "apps/.env"),
    path.resolve(process.cwd(), "apps/api/.env.local"),
    path.resolve(process.cwd(), "apps/web/.env"),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf8");
        parseEnv(content);
      }
    } catch (err) {
      // ignore
    }
  }
}

loadDotenvFiles();

// sanitized debug
const masked = (s?: string) => (s ? s.slice(0, 6) + "..." : "(missing)");
console.log("[env check] PAYPAL_CLIENT_ID=", masked(process.env.PAYPAL_CLIENT_ID));
console.log("[env check] PAYPAL_CLIENT_SECRET=", process.env.PAYPAL_CLIENT_SECRET ? "(present)" : "(missing)");

const SANDBOX_BASE_URL = "https://api-m.sandbox.paypal.com";
const PRODUCTION_BASE_URL = "https://api-m.paypal.com";

// Configuration
const config = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  isProduction: process.env.NODE_ENV === "production",
  
  // Product details
  product: {
    name: "Bunplate Pro Subscription",
    description: "Get unlimited access to all Pro features including advanced image editing, unlimited QR codes, and priority support.",
    type: "SERVICE" as const,
    category: "SOFTWARE" as const,
    imageUrl: "https://example.com/images/pro-badge.png",
    homeUrl: "https://example.com",
  },
  
  // Plan details
  plan: {
    name: "Bunplate Pro - Monthly",
    description: "Monthly Pro subscription with unlimited features - $1.99/month",
    price: "1.99",
    currency: "USD",
  },
};

// Get base URL based on environment
const getBaseUrl = () => 
  config.isProduction ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;

/**
 * Step 1: Get OAuth Access Token (tries both sandbox and live)
 */
async function getAccessToken(): Promise<{ token: string; usedLive: boolean }> {
  console.log("🔐 Step 1: Getting OAuth access token...");
  
  if (!config.clientId || !config.clientSecret) {
    throw new Error(
      "Missing PayPal credentials. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env"
    );
  }
  
  const auth = Buffer.from(
    `${config.clientId}:${config.clientSecret}`
  ).toString("base64");
  
  // Try sandbox first
  console.log("   Trying SANDBOX endpoint...");
  let response = await fetch(`${SANDBOX_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  
  if (response.ok) {
    const data = await response.json() as { access_token: string };
    console.log(`✅ Got access token from SANDBOX: ${data.access_token.substring(0, 20)}...`);
    return { token: data.access_token, usedLive: false };
  }
  
  const sandboxError = await response.text();
  console.log(`   ⚠️  Sandbox failed: ${sandboxError}`);
  
  // Try live endpoint
  console.log("   Trying LIVE/PRODUCTION endpoint...");
  response = await fetch(`${PRODUCTION_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  
  if (!response.ok) {
    const liveError = await response.text();
    throw new Error(`Failed to get access token from both endpoints.\nSandbox: ${sandboxError}\nLive: ${liveError}`);
  }
  
  const data = await response.json() as { access_token: string };
  console.log(`✅ Got access token from LIVE/PRODUCTION: ${data.access_token.substring(0, 20)}...`);
  
  return { token: data.access_token, usedLive: true };
}

/**
 * Step 2: Create Product
 */
async function createProduct(accessToken: string, baseUrl: string): Promise<string> {
  console.log("\n📦 Step 2: Creating PayPal product...");
  
  const response = await fetch(`${baseUrl}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: config.product.name,
      description: config.product.description,
      type: config.product.type,
      category: config.product.category,
      image_url: config.product.imageUrl,
      home_url: config.product.homeUrl,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create product: ${error}`);
  }
  
  const data = await response.json() as { id: string; name: string };
  console.log(`✅ Created Product:`);
  console.log(`   ID: ${data.id}`);
  console.log(`   Name: ${data.name}`);
  
  return data.id;
}

/**
 * Step 3: Create Subscription Plan
 */
async function createSubscriptionPlan(
  accessToken: string,
  productId: string,
  baseUrl: string
): Promise<string> {
  console.log("\n💳 Step 3: Creating subscription plan...");
  
  const response = await fetch(`${baseUrl}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      product_id: productId,
      name: config.plan.name,
      description: config.plan.description,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // 0 = infinite recurring
          pricing_scheme: {
            fixed_price: {
              value: config.plan.price,
              currency_code: config.plan.currency,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: config.plan.currency,
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: "0",
        inclusive: false,
      },
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create plan: ${error}`);
  }
  
  const data = await response.json() as {
    id: string;
    name: string;
    status: string;
  };
  
  console.log(`✅ Created Subscription Plan:`);
  console.log(`   ID: ${data.id}`);
  console.log(`   Name: ${data.name}`);
  console.log(`   Status: ${data.status}`);
  
  return data.id;
}

/**
 * Main execution
 */
async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 PayPal Product & Plan Creator");
  console.log(`   Mode: ${config.isProduction ? "PRODUCTION" : "SANDBOX"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  try {
    // Step 1: Get access token
    const { token: accessToken, usedLive } = await getAccessToken();
    const baseUrl = usedLive ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
    
    console.log(`\n🌐 Using ${usedLive ? 'LIVE/PRODUCTION' : 'SANDBOX'} API\n`);
    
    // Step 2: Create product
    const productId = await createProduct(accessToken, baseUrl);
    
    // Step 3: Create subscription plan
    const planId = await createSubscriptionPlan(accessToken, productId, baseUrl);
    
    // Success!
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 SUCCESS! Add these to your .env file:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(`PAYPAL_PRODUCT_ID=${productId}`);
    console.log(`PAYPAL_PLAN_PRO=${planId}`);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✅ Next steps:");
    console.log("   1. Copy the PAYPAL_PLAN_PRO value to apps/api/.env");
    console.log("   2. Restart your API server");
    console.log("   3. Test the subscription flow at /billing");
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    console.error("\nMake sure you have:");
    console.error("  • PAYPAL_CLIENT_ID in your .env");
    console.error("  • PAYPAL_CLIENT_SECRET in your .env");
    console.error("  • Valid PayPal sandbox credentials");
    console.error("\nFor help, see: PAYPAL_API_GUIDE.md\n");
    process.exit(1);
  }
}

// Run the script
main();
