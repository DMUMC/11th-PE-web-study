import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

// CreateRatingRequest.java는 아직 못 봤어요. movieId, score, comment로 추정이에요.
export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment: string;
}

export function createRating(body: CreateRatingRequest) {
  return apiClient
    .post("ratings", { json: body })
    .json<ApiResponse<RatingResponse>>();
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return apiClient
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<RatingResponse>>();
}

// 공개 API라 토큰이 필요 없어요. 응답을 감싸지 않고 배열로 줘요
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<RatingResponse[]>();
}