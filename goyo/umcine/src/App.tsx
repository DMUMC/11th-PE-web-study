
import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies } from "./data/movies";

const MOVIES_PER_PAGE = 10;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(
    movies
      .filter((movie) => movie.isBookmarked)
      .map((movie) => movie.id)
  );

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id)
        ? prev.filter((movieId) => movieId !== id)
        : [...prev, id]
    );
  };

  const totalPages = Math.ceil(
    movies.length / MOVIES_PER_PAGE
  );

  const currentMovies = movies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  return (
    <>
      <Header />

      <main className="movie-page">
        <h1 className="movie-page-title">영화 목록</h1>

        <MovieGrid
          movies={currentMovies}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}
