import { useState } from "react";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

import { movies as initialMovies } from "./data/movies";

import "./app.css";

function App() {
  const [movies, setMovies] = useState(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie
      )
    );
  };

  return (
    <>
      <Header />

      <main className="container">
        <section className="movie-section">
          <h1>영화 목록</h1>

          <MovieGrid
            movies={movies}
            onToggleBookmark={handleToggleBookmark}
          />

          <Pagination />
        </section>
      </main>
    </>
  );
}

export default App;