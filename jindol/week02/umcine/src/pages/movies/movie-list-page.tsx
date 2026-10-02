import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [movieList, setMovieList] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          영화 목록
        </h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          총 {movieList.length}편
        </span>
      </div>

      <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
