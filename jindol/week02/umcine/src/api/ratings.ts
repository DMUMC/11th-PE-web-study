import { authApi } from "./auth-api";
import { readApiResponse } from "./api-response";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment: string;
}

export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await authApi.get(`members/${memberId}/ratings`);
  if (!response.ok) {
    throw new Error(`평점을 불러오지 못했어요. (${response.status})`);
  }
  return response.json<Rating[]>();
}

export async function createRating(request: CreateRatingRequest): Promise<Rating> {
  const response = await authApi.post("ratings", { json: request });
  return readApiResponse<Rating>(response);
}

export async function updateRating(
  ratingId: number,
  request: UpdateRatingRequest,
): Promise<Rating> {
  const response = await authApi.patch(`ratings/${ratingId}`, { json: request });
  return readApiResponse<Rating>(response);
}

export async function deleteRating(ratingId: number): Promise<void> {
  const response = await authApi.delete(`ratings/${ratingId}`);
  await readApiResponse<unknown>(response);
}
