import { queryOptions } from "@tanstack/react-query";
import { getMovies, type GetMoviesRequest } from "./get-movies";
import { getMovieDetail } from "./get-movie-detail";
import { searchMovies, type SearchMoviesRequest } from "./search-movies";

export const movieQueries = {
  all: () => ["movies"] as const,
  lists: () => [...movieQueries.all(), "list"] as const,
  list: (params: GetMoviesRequest = { page: 1 }) =>
    queryOptions({
      queryKey: [...movieQueries.lists(), params],
      queryFn: () => getMovies(params),
    }),
  details: () => [...movieQueries.all(), "detail"] as const,
  detail: (movieId: number) =>
    queryOptions({
      queryKey: [...movieQueries.details(), movieId],
      queryFn: () => getMovieDetail(movieId),
      enabled: Number.isInteger(movieId) && movieId > 0,
      staleTime: 5 * 60 * 1000, // 상세 화면은 5분 동안 fresh 유지
    }),
  searches: () => [...movieQueries.all(), "search"] as const,
  search: (params: SearchMoviesRequest) => {
    const normalizedQuery = params.query.trim();
    return queryOptions({
      queryKey: [...movieQueries.searches(), { ...params, query: normalizedQuery }],
      queryFn: () => searchMovies({ ...params, query: normalizedQuery }),
      enabled: normalizedQuery.length > 0,
    });
  },
};

