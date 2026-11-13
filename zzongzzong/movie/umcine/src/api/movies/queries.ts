import { queryOptions } from "@tanstack/react-query";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";
import { getMovieDetail } from "./get-movie-detail";

export const movieQueries = {
  list: (page: number) => queryOptions({
    queryKey: ["movies", "list", { page }] as const,
    queryFn: () => getMovies({ page }),
  }),
  search: (query: string, page = 1) => queryOptions({
    queryKey: ["movies", "search", { query, page }] as const,
    queryFn: () => searchMovies({ query, page }),
    enabled: query.length > 0,
  }),
  detail: (movieId: number) => queryOptions({
    queryKey: ["movies", "detail", movieId] as const,
    queryFn: () => getMovieDetail(movieId),
    enabled: Number.isSafeInteger(movieId) && movieId > 0,
  }),
};
