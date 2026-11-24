import type { Movie } from '../../types/movie';
import { MovieCard } from './movie-card';

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section
      className="grid grid-cols-2 gap-x-3.5 gap-y-6 md:grid-cols-3 xl:grid-cols-5"
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
