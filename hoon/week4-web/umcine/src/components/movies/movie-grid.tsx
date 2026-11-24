import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";
import { usePreferenceStore } from "../../stores/preference-store";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark?: (movieId: number) => void;
}

export function MovieGrid({ movies }: MovieGridProps) {
  const cardSize = usePreferenceStore((state) => state.cardSize);

  return (
    <section
      className={
        cardSize === "large"
          ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      }
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}

export default MovieGrid;
