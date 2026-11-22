import { authApi, type ApiResponse } from "./api-client";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export async function getFavorites(signal?: AbortSignal) {
  const response = await authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>();
  return response.result;
}

export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  const response = await authApi.get(`favorites/${movieId}`, { signal })
    .json<ApiResponse<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

export async function addFavorite(movieId: number) {
  const response = await authApi.post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
  return response.result;
}

export async function deleteFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}
