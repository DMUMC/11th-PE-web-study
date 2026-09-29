import { useState } from "react";
import "./App.css";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";

export default function App() {
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
    <div className="app-shell">
      <Header isLoggedIn={false} />

      <main className="movie-page" id="movies">
        <div className="page-heading">
          <div>
            <span>UMCine Collection</span>
            <h1>영화 목록</h1>
          </div>
          <p>총 {movies.length}편</p>
        </div>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
        <Pagination currentPage={1} totalPages={3} />
      </main>

      <footer className="site-footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </footer>
    </div>
  );
}
