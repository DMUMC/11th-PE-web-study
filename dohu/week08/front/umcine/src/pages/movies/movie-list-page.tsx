import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { StatusMessage } from "../../components/common/status-message";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

// TMDB 인기 영화는 500페이지까지 있지만 화면에서는 5페이지까지만 보여 준다.
const MAX_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // page를 key에 넣어 페이지마다 캐시를 따로 둔다.
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: currentPage }],
    queryFn: () => getMovies({ page: currentPage }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? MAX_PAGES, MAX_PAGES);

  function renderContent() {
    if (moviesQuery.isPending) return <MovieGridSkeleton />;
    if (moviesQuery.isError) {
      return (
        <StatusMessage tone="error">영화 목록을 불러오지 못했어요.</StatusMessage>
      );
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
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
