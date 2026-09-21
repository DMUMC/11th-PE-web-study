import { useState } from "react";
import { movies } from "../data/movies";
import MovieCard from "./movie-card";

const displayMovies = [...movies.slice(0, 8), ...movies.slice(8).reverse()];

export default function MovieGrid() {
  const [movies, setMovies] = useState(displayMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId 
          ? {...movie, isBookmarked: !movie.isBookmarked} 
          : movie,
      ),
    );
  }

  return (
    <section className="movie-section main-container" aria-labelledby="movie-list-title">
      <h1 className="movie-title" id="movie-list-title">영화 목록</h1>
      <div className="movie-grid">
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
