import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { StatusMessage } from "../../components/common/status-message";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    // 페이지가 바뀌면 이전 요청의 결과가 화면을 덮어쓰지 않게 한다.
    return () => {
      ignore = true;
    };
  }, [currentPage]);

  function renderContent() {
    if (isLoading) return <MovieGridSkeleton />;
    if (errorMessage) {
      return <StatusMessage tone="error">{errorMessage}</StatusMessage>;
    }
    if (movies.length === 0) {
      return <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>;
    }
    return <MovieGrid movies={movies} />;
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-[54px] pt-6 lg:px-20">
      <h1 className="text-4xl font-bold leading-[44px] tracking-[-0.72px]">
        영화 목록
      </h1>
      {renderContent()}
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
