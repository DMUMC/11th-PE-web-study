import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";

export interface FavoriteStatus {
  isFavorite: boolean;
}

// 🔒 GET /favorites/{movieId} — 즐겨찾기하지 않았어도 200 + isFavorite: false
export async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
  return response.result;
}
