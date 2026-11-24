import { authApi, type ApiResponse } from "./api-client";
import type { RatingResponse } from "../types/member";

export interface RatingFields {
  score: number;
  comment: string | null;
}

export function createRating(body: RatingFields & { movieId: number }) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<RatingResponse>>();
}

export function updateRating(ratingId: number, body: RatingFields) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<RatingResponse>>();
}

export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}
