import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid.tsx";
import Pagination from "../../components/movies/pagination.tsx";
import { movies as initialMovies } from "../../data/movie.ts";
import "../../App.css";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main className="main-content">
      <h2 className="page-title">영화 목록</h2>
      <MovieGrid
        movies={movies}
        onToggleBookmark={handleToggleBookmark}
      />
      <Pagination currentPage={1} totalPages={1} />
    </main>
  );
}