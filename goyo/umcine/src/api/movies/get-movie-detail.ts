import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./model";

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail(movieId: number) {
  return tmdbClient
    .get(`movie/${movieId}`, {
      searchParams: { language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
}

export { getMovieDetail, type GetMovieDetailResponse };