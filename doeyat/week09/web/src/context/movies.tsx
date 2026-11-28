'use client';
import { useMemo } from 'react';
import { movies } from '../data/movies';
import { useFavorites } from '../hooks/use-favorites';

export function useMovies() {
  const { bookmarkedIds: bookmarkedIds } = useFavorites();

  const { toggleBookmark: toggleBookmark } = useFavorites();

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