/**
 * EXAMPLE: Protected Route with Pro Subscription
 * 
 * This example shows how to protect API routes to require Pro subscription
 */

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorMessageSchema } from "core/zod";

import { authMiddleware } from "@/middlewares/auth.middleware";
import { requireProSubscription } from "@/middlewares/subscription.middleware";
import { APIRouteHandler } from "@/types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTE DEFINITION with Pro Subscription Protection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const advancedCropRoute = createRoute({
  tags: ["Pro Features"],
  summary: "Advanced Image Crop (Pro Only)",
  path: "/pro/advanced-crop",
  method: "post",
  // ✅ Add both auth and subscription middleware
  middleware: [authMiddleware, requireProSubscription],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            image: z.any(),
            width: z.number(),
            height: z.number(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        croppedImageUrl: z.string(),
      }),
      "Successfully cropped image"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "User not authenticated"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      z.object({
        message: z.string(),
        upgradeUrl: z.string().optional(),
      }),
      "Pro subscription required"
    ),
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HANDLER - Only reached if user has active Pro subscription
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const advancedCropHandler: APIRouteHandler<
  typeof advancedCropRoute
> = async (c) => {
  // At this point, the user is guaranteed to:
  // 1. Be authenticated
  // 2. Have Pro or Premium plan
  // 3. Have active subscription status

  const user = c.get("user");
  console.log(`Pro user ${user.email} using advanced crop`);

  // Your advanced crop logic here...
  return c.json(
    {
      croppedImageUrl: "https://example.com/cropped.png",
    },
    HttpStatusCodes.OK
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 2: Route accessible by Pro OR Premium
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { requirePlan } from "@/middlewares/subscription.middleware";

export const premiumFeatureRoute = createRoute({
  tags: ["Premium Features"],
  path: "/premium/batch-process",
  method: "post",
  middleware: [authMiddleware, requirePlan(["pro", "premium"])],
  // ... rest of route
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXAMPLE 3: Basic users can access, but with limits
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const limitedFeatureHandler: APIRouteHandler<any> = async (c) => {
  const user = c.get("user");
  const db = c.get("db");

  if (!user) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  // Fetch user's plan
  const [userData] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  // Apply different limits based on plan
  const monthlyLimit = userData.plan === "basic" ? 10 : Infinity;

  // Your logic with limits...
  return c.json({
    success: true,
    remainingCredits: monthlyLimit - usedThisMonth,
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FRONTEND: Check subscription status
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/*
  "use client";
  
  import { useEffect, useState } from "react";
  import { getClient } from "@/lib/rpc/client";
  import UpgradeButton from "@/components/upgrade-button";

  export default function ProFeaturePage() {
    const [userPlan, setUserPlan] = useState<"basic" | "pro" | "premium">("basic");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      async function fetchSubscription() {
        const client = await getClient();
        const response = await client.api.billing.subscription.$get();
        
        if (response.ok) {
          const data = await response.json();
          setUserPlan(data.plan);
        }
        setIsLoading(false);
      }
      
      fetchSubscription();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    if (userPlan === "basic") {
      return (
        <div className="text-center p-10">
          <h2>Pro Feature</h2>
          <p>This feature requires a Pro subscription</p>
          <UpgradeButton />
        </div>
      );
    }

    return (
      <div>
        <h2>Welcome, Pro User!</h2>
        // Your Pro feature UI here
      </div>
    );
  }
*/
