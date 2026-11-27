import { getTmdbAuth } from "../tmdb-auth";
import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

type GetMovieDetailResponse = TmdbMovieDetail;

function getMovieDetail(movieId: number) {
  const tmdbClient = getTmdbClient();
  return tmdbClient
    .get(`movie/${movieId}`, {
      searchParams: { ...getTmdbAuth().searchParams, language: "ko-KR" },
    })
    .json<GetMovieDetailResponse>();
}

export { getMovieDetail, type GetMovieDetailResponse };