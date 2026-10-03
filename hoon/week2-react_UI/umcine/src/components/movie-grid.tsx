import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (id: number) => void;
}

export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <section className="movie-grid">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleBookmark={onToggleBookmark}
          />
        ))
      ) : (
        <p className="empty-message">표시할 영화가 없습니다.</p>
      )}
    </section>
  );
}
