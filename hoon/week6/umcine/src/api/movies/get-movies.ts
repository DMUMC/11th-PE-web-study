import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";
import { getMockMovieList } from "./mock-movies";

interface GetMoviesRequest {
  page?: number;
}

type GetMoviesResponse = TmdbMovieListResponse;

async function getMovies({ page = 1 }: GetMoviesRequest = {}) {
  try {
    return await tmdbClient
      .get("movie/popular", {
        searchParams: { language: "ko-KR", page },
      })
      .json<GetMoviesResponse>();
  } catch (error) {
    console.warn("TMDB API request failed, using mock data fallback:", error);
    return getMockMovieList(page);
  }
}

export { getMovies, type GetMoviesRequest, type GetMoviesResponse };
