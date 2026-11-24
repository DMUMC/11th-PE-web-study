import MovieGrid from "../../components/movies/movie-grid.tsx";
import Pagination from "../../components/movies/pagination.tsx";
import { movies } from "../../data/movie.ts";
import "../../App.css";

export function MovieListPage() {
  return (
    <main className="main-content">
      <h2 className="page-title">영화 목록</h2>
      <MovieGrid movies={movies} />
      <Pagination currentPage={1} totalPages={1} />
    </main>
  );
}