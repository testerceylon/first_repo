import * as HttpStatusCodes from "stoker/http-status-codes";
import { getDatabase } from "core/database";
import { newsletterSubscribers } from "core/database/schema";
import { eq } from "drizzle-orm";
import type { SubscribeNewsletterRoute } from "@/routes/newsletter.route";
import type { APIRouteHandler } from "@/types";

export const subscribeNewsletter: APIRouteHandler<SubscribeNewsletterRoute> = async (c) => {
  const db = getDatabase();
  const { email, name, source } = c.req.valid("json");

  try {
    // Check if already subscribed
    const [existing] = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing) {
      return c.json({ message: "Already subscribed!" }, HttpStatusCodes.OK);
    }

    await db.insert(newsletterSubscribers).values({
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      name: name ?? null,
      source: source ?? "website",
    });

    return c.json({ message: "Successfully subscribed!" }, HttpStatusCodes.OK);
  } catch (err) {
    console.error("[Newsletter] Subscribe error:", err);
    return c.json({ message: "Failed to subscribe" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};
