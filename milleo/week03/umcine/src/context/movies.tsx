import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Movie } from '../types/movie';
import { movies } from '../data/movies';
const MovieContext = createContext<{ movieList: Movie[]; toggleBookmark: (id: number) => void } | null>(null);
export function MovieProvider({ children }: { children: ReactNode }) {
  const [movieList, setMovieList] = useState(movies);
  function toggleBookmark(id: number) {
    setMovieList(previous => previous.map(movie => movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie));
  }
  return <MovieContext.Provider value={{ movieList, toggleBookmark }}>{children}</MovieContext.Provider>;
}
export function useMovies() {
  const value = useContext(MovieContext);
  if (!value) throw new Error('MovieProvider가 필요합니다.');
  return value;
}
