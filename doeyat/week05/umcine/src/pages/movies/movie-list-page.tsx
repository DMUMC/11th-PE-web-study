import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useCallback, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { useMovieRequest } from "../../hooks/use-movie-request";
import { RequestMessage } from "../../components/movies/request-message";

export function MovieListPage() {
  const [page, setPage] = useState(1);
  return <MovieListContent key={page} page={page} onPageChange={setPage} />;
}

function MovieListContent({ page, onPageChange }: { page: number; onPageChange: (page: number) => void }) {
  const request = useCallback((signal: AbortSignal) => getMovies({ page, signal }), [page]);
  const state = useMovieRequest(request);

  return (
    <main className="min-h-[calc(100vh-220px)] bg-[#f7f8fa]">
      {state.status === "loading" && <RequestMessage>영화 목록을 불러오는 중이에요.</RequestMessage>}
      {state.status === "error" && <RequestMessage error>영화 목록을 불러오지 못했어요.</RequestMessage>}
      {state.status === "success" && (state.data.results.length === 0 ? (
        <RequestMessage>조건에 맞는 영화가 없어요.</RequestMessage>
      ) : (
        <>
          <MovieGrid movies={state.data.results} />
          <Pagination page={page} totalPages={state.data.total_pages} onPageChange={onPageChange} />
        </>
      ))}
    </main>
  );
}
