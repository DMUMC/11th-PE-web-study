import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieListPage() {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>(() => readBookmarkIds());
  const [page, setPage] = useState(1);
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  useEffect(() => {
    saveBookmarkIds(bookmarkIds);
  }, [bookmarkIds]);

  const movieList = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(movie.backdrop_path) ?? "",
    genres: [],
    runtime: "",
    tagline: "",
    overview: movie.overview,
    isBookmarked: bookmarkIds.includes(movie.id),
  }));

  const handleToggleBookmark = (id: number) => {
    setBookmarkIds((prev) =>
      prev.includes(id) ? prev.filter((movieId) => movieId !== id) : [...prev, id],
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          영화 목록
        </h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          총 {movieList.length}편
        </span>
      </div>

      {moviesQuery.isPending ? (
        <p className="mb-4 text-center text-sm text-slate-500">영화 목록을 불러오는 중이에요...</p>
      ) : moviesQuery.isError ? (
        <p role="alert" className="mb-4 text-center text-sm text-red-600">
          {moviesQuery.error.message}
        </p>
      ) : movieList.length === 0 ? (
        <p className="mb-4 text-center text-sm text-slate-500">표시할 영화가 없어요.</p>
      ) : null}

      <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}
