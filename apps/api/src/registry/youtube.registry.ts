import { createAPIRouter } from "@/lib/setup-api";
import * as handlers from "@/handlers/youtube.handlers";
import * as routes from "@/routes/youtube.route";

const router = createAPIRouter().openapi(routes.getLatestVideos, handlers.getLatestVideos);

export default router;
