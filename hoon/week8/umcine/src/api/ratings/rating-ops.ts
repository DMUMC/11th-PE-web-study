import { authApi } from "../auth-api";

export interface RatingItem {
  ratingId: number;
  movieId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
}

interface RatingListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingItem[];
}

export async function getMemberRatings(memberId: number): Promise<RatingItem[]> {
  const response = await authApi.get(`members/${memberId}/ratings`).json<RatingListResponse>();
  return response.result || [];
}

export async function createRating(body: { movieId: number; rating: number; comment?: string }) {
  return authApi.post("ratings", { json: body }).json();
}

export async function updateRating(ratingId: number, body: { rating: number; comment?: string }) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json();
}

export async function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json();
}
