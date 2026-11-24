import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-600">UMCine Collection</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">영화 목록</h1>
          </div>
          <p className="text-sm text-slate-400">총 {movies.length}편</p>
        </div>

        <MovieGrid movies={movies} />
        <Pagination />
      </div>
    </main>
  );
}
