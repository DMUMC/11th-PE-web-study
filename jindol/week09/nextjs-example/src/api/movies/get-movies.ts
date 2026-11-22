import { getTmdbAuth } from "../tmdb-auth";
import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface GetMoviesRequest {
  page?: number;
}

type GetMoviesResponse = TmdbMovieListResponse;

function getMovies({ page = 1 }: GetMoviesRequest = {}) {
  const tmdbClient = getTmdbClient();
  return tmdbClient
    .get("movie/popular", {
      searchParams: { ...getTmdbAuth().searchParams, language: "ko-KR", page },
    })
    .json<GetMoviesResponse>();
}

export { getMovies, type GetMoviesRequest, type GetMoviesResponse };