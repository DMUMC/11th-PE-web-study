import { tmdbClient } from "../../utils/tmdb-client";
import type { TmdbMovieListResponse } from "./models";

export interface GetMoviesRequest {
  page?: number;
}

export type GetMoviesResponse = TmdbMovieListResponse;

export function getMovies(
  { page = 1 }: GetMoviesRequest = {},
): Promise<GetMoviesResponse> {
  return tmdbClient
    .get("movie/popular", {
      searchParams: {
        language: "ko-KR",
        page,
      },
    })
    .json<GetMoviesResponse>();
}