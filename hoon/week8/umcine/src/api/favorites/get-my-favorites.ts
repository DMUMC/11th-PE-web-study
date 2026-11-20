import { authApi } from "../auth-api";

export interface FavoriteItem {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface FavoriteListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteItem[];
}

export async function getMyFavorites(): Promise<FavoriteItem[]> {
  const response = await authApi.get("favorites").json<FavoriteListResponse>();
  return response.result || [];
}
