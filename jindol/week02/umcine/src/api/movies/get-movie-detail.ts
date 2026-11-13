import { tmdbClient } from "../tmdb-client";
import { tmdbAuthSearchParams } from "../tmdb-auth";
import type { TmdbMovieDetail } from "./models";

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail(movieId: number) {
  return tmdbClient
    .get(`movie/${movieId}`, {
      searchParams: { ...tmdbAuthSearchParams, language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
}

export { getMovieDetail, type GetMovieDetailResponse };