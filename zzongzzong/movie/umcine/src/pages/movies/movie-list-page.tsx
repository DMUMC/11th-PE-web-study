import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/queries";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { QueryError, QueryFeedback } from "../../components/movies/query-feedback";
import { toMovie } from "../../utils/movies/to-movie";

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const moviesQuery = useQuery(movieQueries.list(page));
  const data = moviesQuery.data;
  return (
    <div className="px-[84px] py-[24px]">
      <h1 className="text-2xl font-bold mb-6">인기 영화</h1>
      {moviesQuery.isPending ? (
        <p role="status">{moviesQuery.isPaused ? "연결을 기다리고 있어요." : "영화를 불러오는 중이에요."}</p>
      ) : moviesQuery.isError && !data ? (
        <QueryError message="영화 목록을 불러오지 못했어요." onRetry={() => void moviesQuery.refetch()} />
      ) : data ? (
        <>
          <QueryFeedback isFetching={moviesQuery.isFetching} isError={moviesQuery.isError} onRetry={() => void moviesQuery.refetch()} />
          {data.results.length === 0 ? <p>표시할 영화가 없어요.</p> : <MovieGrid movies={data.results.map(toMovie)} />}
          <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  );
}
