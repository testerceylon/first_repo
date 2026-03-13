import { MiddlewareHandler } from "hono";
import { APIBindings } from "./types";
/**
 * Admin-only middleware.
 * Must be used AFTER authMiddleware so the user is already set on context.
 */
export declare const adminMiddleware: MiddlewareHandler<APIBindings>;
