import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { errorMessageSchema } from "core/zod";

const tags: string[] = ["YouTube"];

const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  publishedAt: z.string(),
  viewCount: z.string().nullable(),
  url: z.string(),
});

export const getLatestVideos = createRoute({
  tags,
  summary: "Get latest YouTube videos (cached)",
  path: "/latest",
  method: "get",
  request: {
    query: z.object({
      limit: z.string().optional().default("12"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(videoSchema),
      "List of latest YouTube videos"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to fetch videos"
    ),
  },
});

export type GetLatestVideosRoute = typeof getLatestVideos;
