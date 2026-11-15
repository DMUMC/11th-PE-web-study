import { apiClient } from "./api-client";
import { authApi } from "./auth-api";
import { unwrap, type ApiResponse } from "./api-response";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput { score: number; comment?: string }

export function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}

export async function createRating(body: RatingInput & { movieId: number }) {
  return unwrap(await authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>());
}

export async function updateRating(ratingId: number, body: RatingInput) {
  return unwrap(await authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>());
}

export async function deleteRating(ratingId: number) {
  return unwrap(await authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>());
}
