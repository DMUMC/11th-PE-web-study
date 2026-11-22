import { authApi } from "./auth-api";
import { readApiResponse } from "./api-response";

export interface Favorite {
  movieId: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFavorite(value: unknown): value is Favorite {
  return (
    isRecord(value) &&
    typeof value.movieId === "number" &&
    Number.isInteger(value.movieId) &&
    value.movieId > 0
  );
}

function parseFavoriteList(value: unknown): Favorite[] {
  if (!Array.isArray(value) || !value.every(isFavorite)) {
    throw new Error("즐겨찾기 응답 형식이 올바르지 않아요.");
  }
  return value.map(({ movieId }) => ({ movieId }));
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites");
  if (!response.ok) {
    throw new Error(`즐겨찾기를 불러오지 못했어요. (${response.status})`);
  }
  const body: unknown = await response.json();
  if (Array.isArray(body)) {
    return parseFavoriteList(body);
  }
  if (!isRecord(body)) {
    throw new Error("즐겨찾기 응답 형식이 올바르지 않아요.");
  }
  if (body.isSuccess === false) {
    throw new Error(typeof body.message === "string" ? body.message : "즐겨찾기를 불러오지 못했어요.");
  }
  return parseFavoriteList(body.result);
}

export async function getFavorite(movieId: number): Promise<boolean> {
  const response = await authApi.get(`favorites/${movieId}`);
  if (response.status === 404) return false;
  if (!response.ok) {
    throw new Error(`즐겨찾기 상태를 불러오지 못했어요. (${response.status})`);
  }

  const body: unknown = await response.json();
  if (isRecord(body) && body.isSuccess === false) {
    throw new Error(typeof body.message === "string" ? body.message : "즐겨찾기 상태를 불러오지 못했어요.");
  }
  const result = isRecord(body) && "result" in body ? body.result : body;
  if (typeof result === "boolean") return result;
  if (result === null) return false;
  if (isRecord(result) && typeof result.isFavorite === "boolean") {
    return result.isFavorite;
  }
  if (isFavorite(result)) return true;
  throw new Error("즐겨찾기 상태 응답 형식이 올바르지 않아요.");
}

export async function addFavorite(movieId: number): Promise<void> {
  const response = await authApi.post("favorites", { json: { movieId } });
  await readApiResponse<unknown>(response);
}

export async function removeFavorite(movieId: number): Promise<void> {
  const response = await authApi.delete(`favorites/${movieId}`);
  await readApiResponse<unknown>(response);
}
