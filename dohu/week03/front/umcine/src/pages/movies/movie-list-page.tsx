import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  // 선택한 영화만 새 객체로 바꾸고 나머지는 그대로 둔다.
  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-[54px] pt-6 lg:px-20">
      <h1 className="text-4xl font-bold leading-[44px] tracking-[-0.72px]">
        영화 목록
      </h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
