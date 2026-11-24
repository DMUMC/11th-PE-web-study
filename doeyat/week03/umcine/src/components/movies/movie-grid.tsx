import { useState } from "react";
import { movies } from "../../data/movies";
import MovieCard from "./movie-card";

const displayMovies = [...movies.slice(0, 8), ...movies.slice(8).reverse()];

export default function MovieGrid() {
  const [movies, setMovies] = useState(displayMovies);

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
    <section className="bg-[#f7f8fa] px-5 py-6 sm:px-10 lg:px-20" aria-labelledby="movie-list-title">
      <h1 className="mb-5 text-3xl leading-11 font-bold tracking-[-1px] text-[#1d1e20] sm:text-4xl" id="movie-list-title">영화 목록</h1>
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </div>
    </section>
  );
}
