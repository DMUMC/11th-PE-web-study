import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";
import type { Favorite } from "./favorite-types";

// 🔒 GET /favorites — 내 즐겨찾기 (최신 등록 순)
export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}
