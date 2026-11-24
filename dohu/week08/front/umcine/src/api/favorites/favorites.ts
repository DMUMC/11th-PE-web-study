import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface ApiResult<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResult<Favorite[]>>();
  return response.result;
}

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResult<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResult<Favorite>>();
}

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResult<null>>();
}
