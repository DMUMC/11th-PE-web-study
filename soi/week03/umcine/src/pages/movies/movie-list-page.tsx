import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import "../../App.css";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  }

  return (
    <>
      <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-[1280px] px-10 pt-10 pb-[60px]">
      <h1 className="mb-7 text-[28px] font-bold">영화 목록</h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination />
      </main>

      <footer className="w-full bg-white px-20 py-4 text-right text-[10px] text-[#9a9a9a]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </>
  );
}