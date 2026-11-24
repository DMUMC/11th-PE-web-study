import { useAuthStore } from "../stores/auth-store";
import { API_BASE_URL, ApiError } from "./member-api";
import type { RatingResponse } from "../types/member";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
  memberId?: number | string;
  id?: number | string;
}

interface Favorite {
  movieId: number;
}

interface RatingInput {
  score: number;
  comment: string;
}

interface ApiEnvelope<T> {
  isSuccess?: boolean;
  message?: string;
  result: T;
}


async function request<T>(
  path: string,
  { token, method = "GET", body, signal }: {
    token?: string;
    method?: string;
    body?: object;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (body) headers.set("Content-Type", "application/json");

  const response = await fetch(API_BASE_URL + path, {
    method, headers, signal, body: body && JSON.stringify(body),
  });
  if (response.status === 401 && token === useAuthStore.getState().accessToken) {
    useAuthStore.getState().setAccessToken(null);
  }
  const raw = await response.text();
  if (!response.ok) throw new ApiError(response.status);
  const data: T | ApiEnvelope<T> = raw ? JSON.parse(raw) : null;
  if (data && typeof data === "object") {
    if ("isSuccess" in data && data.isSuccess === false) {
      throw new Error(data.message || "요청에 실패했습니다.");
    }
    if ("result" in data) return data.result;
  }
  return data as T;
}

export const login = (body: { email: string; password: string }) =>
  request<{ accessToken: string }>("/auth/login", { method: "POST", body });
export const getMe = (token: string, signal?: AbortSignal) =>
  request<MemberInfo>("/members/me", { token, signal });
export const updateMe = (token: string, nickname: string) =>
  request<MemberInfo>("/members/me", { token, method: "PATCH", body: { nickname } });
export const getFavorites = (token: string, signal?: AbortSignal) =>
  request<Array<Favorite | number>>("/favorites", { token, signal });

export async function getFavorite(token: string, movieId: number, signal?: AbortSignal) {
  try {
    const result = await request<boolean | Favorite | { isFavorite: boolean } | null>(
      `/favorites/${movieId}`, { token, signal },
    );
    if (typeof result === "boolean") return result;
    if (!result) return false;
    return "isFavorite" in result ? result.isFavorite : result.movieId === movieId;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return false;
    throw error;
  }
}

export const addFavorite = (token: string, movieId: number) =>
  request<void>("/favorites", { token, method: "POST", body: { movieId } });
export const deleteFavorite = (token: string, movieId: number) =>
  request<void>(`/favorites/${movieId}`, { token, method: "DELETE" });
export const getRatings = (token: string, memberId: string, signal?: AbortSignal) =>
  request<RatingResponse[]>(`/members/${encodeURIComponent(memberId)}/ratings`, { token, signal });
export const addRating = (token: string, movieId: number, rating: RatingInput) =>
  request<void>("/ratings", { token, method: "POST", body: { movieId, ...rating } });
export const updateRating = (token: string, ratingId: number, body: RatingInput) =>
  request<void>(`/ratings/${ratingId}`, { token, method: "PATCH", body });
export const deleteRating = (token: string, ratingId: number) =>
  request<void>(`/ratings/${ratingId}`, { token, method: "DELETE" });

export function getMemberId(member: MemberInfo | undefined, token: string): string | undefined {
  const id = member?.memberId ?? member?.id;
  if (id != null) return String(id);

  // The login response may omit the member ID. Read numeric identifiers from the token for lookup.
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(payload));
    const claim = claims.memberId ?? claims.userId ?? claims.id ?? claims.sub;
    if (typeof claim === "number" || (typeof claim === "string" && /^\d+$/.test(claim))) {
      return String(claim);
    }
  } catch {
    return undefined;
  }
}
