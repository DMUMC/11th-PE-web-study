import { useState } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

const COLUMNS = 5;

export default function MovieGrid({ movies }: { movies: Movie[] }) {
  const [bookmarkedIds, setBookmarkedIds] = useState(
    movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id)
  );

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

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
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.includes(movie.id)}
          onToggleBookmark={toggleBookmark}
        />
      ))}
    </div>
  );
}
