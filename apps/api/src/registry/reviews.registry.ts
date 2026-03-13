import { createAPIRouter } from "@/lib/setup-api";
import * as handlers from "@/handlers/reviews.handlers";
import * as routes from "@/routes/reviews.route";

const router = createAPIRouter()
    .openapi(routes.getApprovedReviews, handlers.getApproved)
    .openapi(routes.submitReview, handlers.submit);

export default router;
