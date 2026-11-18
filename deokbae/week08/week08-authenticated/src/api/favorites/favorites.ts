import { apiClient } from "../api-client";
import type { ApiResponse } from "../api-response";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

// CreateFavoriteRequest.java는 아직 못 봤어요. movieId 하나로 추정이에요.
export interface CreateFavoriteRequest {
  movieId: number;
}

// getMe처럼 result를 벗겨서 배열만 돌려줘요
export async function getFavorites() {
  const response = await apiClient
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();
  return response.result;
}

export function createFavorite(body: CreateFavoriteRequest) {
  return apiClient
    .post("favorites", { json: body })
    .json<ApiResponse<Favorite>>();
}

export function deleteFavorite(movieId: number) {
  return apiClient.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}