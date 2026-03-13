import { createAPIRouter } from "@/lib/setup-api";
import { OpenAPI } from "@/types";

import { BASE_PATH } from "@/lib/constants";

import index from "../routes/index.route";
import admin from "./admin.registry";
import reviews from "./reviews.registry";
import blog from "./blog.registry";
import youtube from "./youtube.registry";
import newsletter from "./newsletter.registry";

export function registerRoutes(app: OpenAPI) {
  const registeredApp = app
    .route("/", index)
    .route("/admin", admin)
    .route("/reviews", reviews)
    .route("/blog", blog)
    .route("/youtube", youtube)
    .route("/newsletter", newsletter);

  return registeredApp;
}

// Standalone router instance and type export for RPC
export const router = registerRoutes(createAPIRouter().basePath(BASE_PATH));

export type Router = typeof router;
