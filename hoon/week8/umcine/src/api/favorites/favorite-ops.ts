import { authApi } from "../auth-api";

export interface FavoriteStatus {
  movieId: number;
  isFavorite: boolean;
}

interface FavoriteStatusResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteStatus;
}

export async function getFavoriteStatus(movieId: number): Promise<FavoriteStatus> {
  const response = await authApi.get(`favorites/${movieId}`).json<FavoriteStatusResponse>();
  return response.result;
}

export async function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json();
}

export async function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json();
}
