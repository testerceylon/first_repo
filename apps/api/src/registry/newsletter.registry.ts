import { createAPIRouter } from "@/lib/setup-api";
import * as handlers from "@/handlers/newsletter.handlers";
import * as routes from "@/routes/newsletter.route";

const router = createAPIRouter().openapi(routes.subscribeNewsletter, handlers.subscribeNewsletter);

export default router;
