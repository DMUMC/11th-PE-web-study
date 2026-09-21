import { useState } from "react";
import "./App.css";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid.tsx";
import Pagination from "./components/pagination.tsx";
import { movies as initialMovies } from "./data/movie.ts";


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
    <div className="app">
      <Header />
      <main className="main-content">
        <h2 className="page-title">영화 목록</h2>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination currentPage={1} totalPages={1} />
      </main>
      <footer className="footer">
        <p>This product uses the TMDB API but is not endorsed or certified by {" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>
        </p>
      </footer>
    </div>
  );
}