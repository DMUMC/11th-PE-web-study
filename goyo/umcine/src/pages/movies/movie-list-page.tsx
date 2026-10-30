import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/model";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";

export default function MovieListPage() {
  const bookmarkIds = useBookmarkStore((state) => state.bookmarkIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [currentPage, setCurrentPage] = useState(1);

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovies() {
      setLoading(true);
      setError(null);

      try {
        const response = await getMovies({
          page: currentPage,
        });

        if (cancelled) return;

        setMovies(response.results);
        setTotalPages(Math.min(response.total_pages, 500));
      } catch {
        if (cancelled) return;

        setError("영화 목록을 불러오지 못했어요.");
        setMovies([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [currentPage, retryCount]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#F6F7F9] px-4 py-6 sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <h1 className="mb-5 text-[38px] font-bold leading-[44px] text-[#17191E]">
          영화 목록
        </h1>

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-[#606774]">
              영화를 불러오는 중이에요...
            </p>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <p className="text-sm text-[#606774]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((prev) => prev + 1)}
              className="cursor-pointer rounded-lg bg-[#17191E] px-5 py-3 text-sm font-bold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-[#606774]">
              등록된 영화가 없어요.
            </p>
          </div>
        ) : (
          <>
            <MovieGrid
              movies={movies}
              bookmarkedIds={bookmarkIds}
              onToggleBookmark={toggleBookmark}
            />

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}