import type { MovieSummary } from '../../types/movie';
import { MovieCard } from './movie-card';

interface MovieGridProps {
  movies: MovieSummary[];
  variant?: 'list' | 'search';
}

export function MovieGrid({ movies, variant = 'list' }: MovieGridProps) {
  return (
    <section
      className="grid grid-cols-2 gap-x-3.5 gap-y-6 md:grid-cols-3 lg:grid-cols-5"
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} variant={variant} />
      ))}
    </section>
  );
}
