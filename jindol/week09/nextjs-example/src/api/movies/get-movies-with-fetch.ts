import { env } from "../../config/env";
import { getTmdbAuth } from "../tmdb-auth";
import type { TmdbMovieListResponse } from "./models";

type GetMoviesWithFetchResponse = TmdbMovieListResponse;

async function getMoviesWithFetch(
  page = 1,
): Promise<GetMoviesWithFetchResponse> {
  if (!env.tmdbApiBaseUrl) {
    throw new Error("NEXT_PUBLIC_TMDB_API_BASE_URL 환경 변수가 필요해요.");
  }
  const tmdbAuth = getTmdbAuth();
  const authSearchParams: Record<string, string> = tmdbAuth.searchParams;
  const searchParams = new URLSearchParams({
    ...authSearchParams,
    language: "ko-KR",
    page: String(page),
  });

  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
    {
      headers: tmdbAuth.headers,
    },
  );

  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}

export { getMoviesWithFetch, type GetMoviesWithFetchResponse };