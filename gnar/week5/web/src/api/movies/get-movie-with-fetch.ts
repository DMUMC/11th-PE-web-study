import { env } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

export async function getMoviesWithFetch(
  page = 1,
): Promise<TmdbMovieListResponse> {
  const searchParams = new URLSearchParams({
    language: "ko-KR",
    page: String(page),
  });

  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${env.tmdbAccessToken}`,
      },
    },
  );

  // fetch는 401, 404, 500 응답만으로는 오류를 던지지 않습니다.
  if (!response.ok) {
    throw new Error(
      `영화 목록 요청에 실패했어요. HTTP ${response.status}`,
    );
  }

  return response.json();
}