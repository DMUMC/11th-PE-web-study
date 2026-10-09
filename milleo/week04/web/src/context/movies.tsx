import { useMemo } from 'react';
import { movies } from '../data/movies';
import { useBookmarkStore } from '../stores/bookmark-store';

export function useMovies() {
  const bookmarkedIds = useBookmarkStore(
    (state) => state.bookmarkedIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const movieList = useMemo(
    () =>
      movies.map((movie) => ({
        ...movie,
        isBookmarked: bookmarkedIds.includes(movie.id),
      })),
    [bookmarkedIds],
  );

  return { movieList, toggleBookmark };
}