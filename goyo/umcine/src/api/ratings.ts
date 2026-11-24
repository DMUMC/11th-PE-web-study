
import { authApi } from "./auth-api";
import type { ApiResponse } from "./favorites";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

export async function getMemberRatings(
  memberId: number,
): Promise<Rating[]> {
  const response = await authApi
    .get(`members/${memberId}/ratings`)
    .json<ApiResponse<Rating[]> | Rating[]>();

  return Array.isArray(response)
    ? response
    : response.result;
}

export async function createRating(
  body: CreateRatingRequest,
): Promise<ApiResponse<Rating>> {
  return authApi
    .post("ratings", {
      json: body,
    })
    .json<ApiResponse<Rating>>();
}

export async function updateRating(
  ratingId: number,
  body: UpdateRatingRequest,
): Promise<ApiResponse<Rating>> {
  return authApi
    .patch(`ratings/${ratingId}`, {
      json: body,
    })
    .json<ApiResponse<Rating>>();
}

export async function deleteRating(
  ratingId: number,
): Promise<ApiResponse<null>> {
  return authApi
    .delete(`ratings/${ratingId}`)
    .json<ApiResponse<null>>();
}
