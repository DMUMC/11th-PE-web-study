export const movieQueryKeys = {
  all: ["movies"] as const,
  lists: () => [...movieQueryKeys.all, "list"] as const,
  list: (page: number) => [...movieQueryKeys.lists(), { page }] as const,
  searches: () => [...movieQueryKeys.all, "search"] as const,
  search: (query: string) =>
    [...movieQueryKeys.searches(), { query }] as const,
  details: () => [...movieQueryKeys.all, "detail"] as const,
  detail: (movieId: number) =>
    [...movieQueryKeys.details(), movieId] as const,
};
