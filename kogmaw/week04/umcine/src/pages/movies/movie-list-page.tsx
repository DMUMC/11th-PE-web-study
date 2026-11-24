import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { movies } from '../../data/movies';

export function MovieListPage() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f5f7f9]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-16">
        <h1 className="mb-[22px] text-[28px] font-bold leading-[1.2] tracking-[-1px] text-[#17191c]">
          영화 목록
        </h1>
        <MovieGrid movies={movies} />
        <Pagination currentPage={1} totalPages={1} />
      </div>
    </main>
  );
}
