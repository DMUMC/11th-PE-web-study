
import { authApi } from "./auth-api";

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt?: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export function getFavorites(): Promise<ApiResponse<Favorite[]>> {
  return authApi
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();
}

export function getFavoriteStatus(
  movieId: number,
): Promise<ApiResponse<FavoriteStatus>> {
  return authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
}

export function createFavorite(
  movieId: number,
): Promise<ApiResponse<Favorite>> {
  return authApi
    .post("favorites", {
      json: { movieId },
    })
    .json<ApiResponse<Favorite>>();
}

export async function deleteFavorite(
  movieId: number,
): Promise<void> {
  await authApi.delete(`favorites/${movieId}`);
}
