import { useNavigate } from '@tanstack/react-router';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { MovieGridSkeleton, RequestMessage } from '../../components/movies/request-message';
import type { MoviePage } from '../../types/movie';

export function MovieListPage({ data }: { data?: MoviePage }) {
  const navigate = useNavigate();

  return (
    <main className="w-full flex-1">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-16">
        <h1 className="mb-[22px] text-[28px] font-bold leading-[1.2] tracking-[-1px] text-[#17191c]">영화 목록</h1>
        {!data ? <MovieGridSkeleton /> : data.results.length === 0 ? (
          <RequestMessage title="표시할 영화가 없어요." description="잠시 후 다시 방문해 주세요." />
        ) : (
          <>
            <MovieGrid movies={data.results} />
            <Pagination
              currentPage={data.page}
              totalPages={data.total_pages}
              onPageChange={(page) => { void navigate({ to: '/', search: page === 1 ? {} : { page } }); }}
            />
          </>
        )}
      </div>
    </main>
  );
}
