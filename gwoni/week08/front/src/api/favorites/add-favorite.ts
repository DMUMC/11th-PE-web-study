import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";
import type { Favorite } from "./favorite-types";

// 🔒 POST /favorites — 이미 등록했으면 409 FAVORITE409_1
export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}
