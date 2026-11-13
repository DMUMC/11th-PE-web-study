
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";

export default function MovieListPage() {
  const bookmarkIds = useBookmarkStore((state) => state.bookmarkIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [currentPage, setCurrentPage] = useState(1);

  // TanStack Query를 이용한 영화 목록 API 요청
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["movies", "list", currentPage],
    queryFn: () =>
      getMovies({
        page: currentPage,
      }),
  });

  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 1, 500);

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

        {isPending ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm text-[#606774]">
              영화를 불러오는 중이에요...
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <p className="text-sm text-[#606774]">
              영화 목록을 불러오지 못했어요.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
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
