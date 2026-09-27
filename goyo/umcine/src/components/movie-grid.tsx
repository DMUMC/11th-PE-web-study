
import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
}

export default function MovieGrid({
  movies,
  bookmarkedIds,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section
      className="movie-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        columnGap: "16px",
        rowGap: "24px",
        width: "100%",
        boxSizing: "border-box",
        padding: "24px 40px 48px",
        backgroundColor: "#F6F7F9",
      }}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.includes(movie.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}
