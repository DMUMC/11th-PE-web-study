import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { RequestMessage } from "../../components/movies/request-message";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="min-h-[calc(100vh-220px)] bg-[#f7f8fa]">
      {moviesQuery.isPending ? (
        <RequestMessage>영화 목록을 불러오는 중이에요.</RequestMessage>
      ) : moviesQuery.isError ? (
        <RequestMessage error>영화 목록을 불러오지 못했어요.</RequestMessage>
      ) : movies.length === 0 ? (
        <RequestMessage>조건에 맞는 영화가 없어요.</RequestMessage>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  );
}
