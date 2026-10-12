import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieListPage() {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>(() => readBookmarkIds());
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

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

      {isLoading ? (
        <p className="mb-4 text-center text-sm text-slate-500">영화 목록을 불러오는 중이에요...</p>
      ) : errorMessage ? (
        <p role="alert" className="mb-4 text-center text-sm text-red-600">
          {errorMessage}
        </p>
      ) : movieList.length === 0 ? (
        <p className="mb-4 text-center text-sm text-slate-500">표시할 영화가 없어요.</p>
      ) : null}

      <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
}
