import type { APIRouteHandler } from "./types";
import type { GetApprovedReviewsRoute, SubmitReviewRoute } from "./routes/reviews.route";
export declare const getApproved: APIRouteHandler<GetApprovedReviewsRoute>;
export declare const submit: APIRouteHandler<SubmitReviewRoute>;
