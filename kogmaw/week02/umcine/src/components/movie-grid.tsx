import type { Movie } from '../types/movie';
import { MovieCard } from './movie-card';

interface MovieGridProps {
  movies: Movie[];
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieGrid({ movies, onBookmarkToggle }: MovieGridProps) {
  return (
    <section className="movie-grid" id="movies" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </section>
  );
}
