import { MiddlewareHandler } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { APIBindings } from "@/types";

/**
 * Admin-only middleware.
 * Must be used AFTER authMiddleware so the user is already set on context.
 */
export const adminMiddleware: MiddlewareHandler<APIBindings> = async (
  c,
  next
) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      { message: "Unauthorized" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      { message: "Forbidden: admin access required" },
      HttpStatusCodes.FORBIDDEN
    );
  }

  return next();
};
