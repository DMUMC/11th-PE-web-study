import { tmdbClient } from "../../utils/tmdb-client";
import type { TmdbMovieListResponse } from "./models";

export interface SearchMoviesRequest {
  query: string;
  page?: number;
}

export type SearchMoviesResponse = TmdbMovieListResponse;

export function searchMovies({
  query,
  page = 1,
}: SearchMoviesRequest): Promise<SearchMoviesResponse> {
  return tmdbClient
    .get("search/movie", {
      searchParams: {
        query,
        page,
        language: "ko-KR",
        include_adult: false,
      },
    })
    .json<SearchMoviesResponse>();
}