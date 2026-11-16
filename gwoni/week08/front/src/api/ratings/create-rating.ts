import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

// 🔒 POST /ratings — 같은 영화 재등록이면 409 RATING409_1
export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<{ ratingId: number }>>();
}
