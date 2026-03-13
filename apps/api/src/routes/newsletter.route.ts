import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorMessageSchema } from "core/zod";

const tags: string[] = ["Newsletter"];

export const subscribeNewsletter = createRoute({
  tags,
  summary: "Subscribe to the newsletter",
  path: "/subscribe",
  method: "post",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email("Invalid email address"),
            name: z.string().optional(),
            source: z.string().optional().default("website"),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Successfully subscribed"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid email or already subscribed"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to subscribe"
    ),
  },
});

export type SubscribeNewsletterRoute = typeof subscribeNewsletter;
