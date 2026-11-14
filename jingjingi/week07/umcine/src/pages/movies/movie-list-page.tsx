import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { movieQueryKeys } from "../../api/movies/query-keys";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

function MovieListSkeleton() {
  return (
    <div
      aria-label="영화 목록을 불러오는 중이에요."
      className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[2/3] rounded-xl bg-slate-200" />
          <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-1/3 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const moviesQuery = useQuery({
    queryKey: movieQueryKeys.list(page),
    queryFn: ({ signal }) => getMovies({ page, signal }),
  });
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 1, 500);
  const totalResults = moviesQuery.data?.total_results ?? 0;

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-600">UMCine Collection</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">영화 목록</h1>
          </div>
          {moviesQuery.isSuccess && (
            <p className="text-sm text-slate-400">
              총 {totalResults.toLocaleString("ko-KR")}편
            </p>
          )}
        </div>

        {moviesQuery.isPending ? (
          <MovieListSkeleton />
        ) : moviesQuery.isError ? (
          <section className="rounded-2xl border border-red-200 bg-white py-24 text-center">
            <p className="text-lg font-bold text-slate-900">영화 목록을 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={() => void moviesQuery.refetch()}
              className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              다시 시도
            </button>
          </section>
        ) : movies.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
            <p className="text-lg font-bold text-slate-800">조건에 맞는 영화가 없어요.</p>
          </section>
        ) : (
          <>
            {moviesQuery.isFetching && (
              <p className="mb-3 text-right text-xs font-semibold text-brand-600">
                최신 목록을 확인하는 중이에요.
              </p>
            )}
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}
