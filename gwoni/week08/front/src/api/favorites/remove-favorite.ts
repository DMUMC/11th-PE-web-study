import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";

// 🔒 DELETE /favorites/{movieId} — 없으면 404 FAVORITE404_1
export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
