import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies);

  const handleToggleBookmark = (movieId: number) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] px-10 py-10">
      <h1 className="mb-6 text-[28px] font-bold text-gray-900">영화 목록</h1>
      <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />
    </main>
  );
}

export default MovieListPage;
