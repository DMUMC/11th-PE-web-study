import "server-only";
import { cacheLife } from "next/cache";
import type {
  TmdbMovieDetail,
  TmdbMovieListResponse,
} from "@/api/movies/models";

// TMDB 토큰은 서버에서만 읽는다. 브라우저는 이 함수 결과만 HTML이나 Route Handler로 받는다.
const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_API_BASE_URL || !TMDB_ACCESS_TOKEN) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export class TmdbNotFoundError extends Error {}

async function tmdbGet<T>(path: string, searchParams: Record<string, string>) {
  const url = new URL(`${TMDB_API_BASE_URL}/${path}`);
  Object.entries(searchParams).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` },
  });

  if (response.status === 404) {
    throw new TmdbNotFoundError(`TMDB에 ${path}가 없어요.`);
  }
  if (!response.ok) {
    throw new Error(`TMDB 요청에 실패했어요. (${response.status})`);
  }
  return (await response.json()) as T;
}

// 인기 영화 목록과 상세는 자주 바뀌지 않아서 인자별로 한 시간 동안 캐시한다.
export async function getPopularMovies(page: number) {
  "use cache";
  cacheLife("hours");
  return tmdbGet<TmdbMovieListResponse>("movie/popular", {
    language: "ko-KR",
    page: String(page),
  });
}

export async function searchMovies(query: string) {
  "use cache";
  cacheLife("minutes");
  return tmdbGet<TmdbMovieListResponse>("search/movie", {
    query,
    language: "ko-KR",
    include_adult: "false",
    page: "1",
  });
}

// 없는 영화는 null로 돌려줘서 페이지가 notFound()를 부를 수 있게 한다.
export async function getMovieDetail(movieId: number) {
  "use cache";
  cacheLife("hours");
  try {
    return await tmdbGet<TmdbMovieDetail>(`movie/${movieId}`, { language: "ko-KR" });
  } catch (error) {
    if (error instanceof TmdbNotFoundError) return null;
    throw error;
  }
}
