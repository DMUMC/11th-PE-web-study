import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";
import { MOCK_MOVIES } from "./mock-movies";

interface SearchMoviesRequest {
  query: string;
  page?: number;
}

type SearchMoviesResponse = TmdbMovieListResponse;

async function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  try {
    return await tmdbClient
      .get("search/movie", {
        searchParams: {
          query,
          language: "ko-KR",
          include_adult: false,
          page,
        },
      })
      .json<SearchMoviesResponse>();
  } catch (error) {
    console.warn("TMDB API search failed, using mock data fallback:", error);
    const filtered = MOCK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.original_title.toLowerCase().includes(query.toLowerCase()),
    );
    const pageSize = 5;
    const start = (page - 1) * pageSize;
    return {
      page,
      results: filtered.slice(start, start + pageSize),
      total_pages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      total_results: filtered.length,
    };
  }
}

export {
  searchMovies,
  type SearchMoviesRequest,
  type SearchMoviesResponse,
};
