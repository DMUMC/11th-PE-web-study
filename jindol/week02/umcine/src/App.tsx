import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

function App() {
  const [movieList, setMovieList] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleBookmark = (id: number) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <div className="app">
      <Header />

      <main className="main">
        <h1 className="page-title">영화 목록</h1>

        <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </main>

      <footer className="footer">
        뭐이리 어렵냐
      </footer>
    </div>
  );
}

export default App;