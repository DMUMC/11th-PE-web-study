import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";
import type { Rating } from "./rating-types";

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

// 🔒 PATCH /ratings/{ratingId} — 남의 평점이면 403 RATING403_1
export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>();
}
