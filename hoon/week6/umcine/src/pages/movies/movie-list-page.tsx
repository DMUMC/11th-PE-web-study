import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/queries";
import MovieGrid from "../../components/movies/movie-grid.tsx";
import Pagination from "../../components/movies/pagination.tsx";
import "../../App.css";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery(movieQueries.list({ page }));

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="main-content">
      <h2 className="page-title">영화 목록</h2>

      {moviesQuery.isPending ? (
        <p>불러오는 중...</p>
      ) : moviesQuery.isError ? (
        <p role="alert">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
