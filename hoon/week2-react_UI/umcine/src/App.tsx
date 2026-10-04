import { useState } from "react";
import { movies as initialMovies } from "./data/movies";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie
      )
    );
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <h2 className="section-title">현재 상영작</h2>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
}