import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

const COLUMNS = 5;

export default function MovieGrid({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return <p>표시할 영화가 없어요.</p>;
  }

  return (
    <div
      className="movie-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLUMNS}, 200px)`,
        gap: 16,
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
