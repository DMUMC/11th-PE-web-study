import { env } from "../../config/env";
import { tmdbAuthHeaders, tmdbAuthSearchParams } from "../tmdb-auth";
import type { TmdbMovieListResponse } from "./models";

type GetMoviesWithFetchResponse = TmdbMovieListResponse;

async function getMoviesWithFetch(
  page = 1,
): Promise<GetMoviesWithFetchResponse> {
  const searchParams = new URLSearchParams({
    ...tmdbAuthSearchParams,
    language: "ko-KR",
    page: String(page),
  });

  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
    {
      headers: tmdbAuthHeaders,
    },
  );

  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}

export { getMoviesWithFetch, type GetMoviesWithFetchResponse };