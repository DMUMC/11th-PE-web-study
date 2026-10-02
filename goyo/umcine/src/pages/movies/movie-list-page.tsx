import { useState } from "react";
import { movies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

const MOVIES_PER_PAGE = 10;

export default function MovieListPage() {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(
    movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id),
  );

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const currentMovies = movies.slice(
    startIndex,
    startIndex + MOVIES_PER_PAGE,
  );

  const handleToggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id)
        ? prev.filter((movieId) => movieId !== id)
        : [...prev, id],
    );
  };

  return (
    <main className="min-h-screen bg-[#F6F7F9] px-4 py-6 sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h1 className="mb-5 text-[38px] font-bold leading-[44px] text-[#17191E]">
          영화 목록
        </h1>

        <MovieGrid
          movies={currentMovies}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
        />

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
}