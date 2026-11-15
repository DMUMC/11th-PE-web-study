import { useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMyInfo } from "@/api/members/get-my-info";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { useBookmarkStore } from "@/stores/bookmark-store";
import MovieGrid from "@/components/movies/movie-grid";
import Pagination from "@/components/movies/pagination";
import "../../App.css";

const PAGE_SIZE = 5;

export function MyPage() {
  const [page, setPage] = useState(1);

  const myInfoQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMyInfo,
  });

  const bookmarkedIds = useBookmarkStore((state) => state.bookmarkedMovieIds);

  const totalPages = Math.max(1, Math.ceil(bookmarkedIds.length / PAGE_SIZE));
  const currentIds = bookmarkedIds.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // 현재 페이지의 영화들만 상세 조회 (같은 키라 상세 페이지와 캐시를 공유해요)
  const movieQueries = useQueries({
    queries: currentIds.map((id) => ({
      queryKey: ["movies", "detail", id],
      queryFn: () => getMovieDetail(id),
    })),
  });

  const movies = movieQueries
    .map((query) => query.data)
    .filter((movie) => movie !== undefined);

  const isMoviesPending = movieQueries.some((query) => query.isPending);

  if (myInfoQuery.isPending) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">
        불러오는 중...
      </main>
    );
  }

  if (myInfoQuery.isError) {
    return (
      <main
        role="alert"
        className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600"
      >
        내 정보를 불러오지 못했어요.
      </main>
    );
  }

  const { nickname, email } = myInfoQuery.data.result;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-12 py-8">
        {/* 제목줄 */}
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            내 정보
          </h1>
          <Link
            to="/mypage/edit"
            className="flex h-8 items-center rounded-md bg-blue-600 px-4 text-xs font-bold text-white hover:bg-blue-700"
          >
            정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="border-t border-slate-200 py-6">
          <h2 className="mb-4 text-sm font-bold text-slate-900">기본 정보</h2>
          <div className="flex items-center gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-slate-200">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-8 text-slate-900"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
              </svg>
            </div>
            <div className="flex gap-24">
              <div>
                <p className="text-[10px] text-slate-400">닉네임</p>
                <p className="mt-1 text-xs font-bold text-slate-900">
                  {nickname}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">이메일</p>
                <p className="mt-1 text-xs font-bold text-slate-900">{email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="border-t border-slate-200 py-6">
          <h2 className="mb-4 text-sm font-bold text-slate-900">내 즐겨찾기</h2>

          {bookmarkedIds.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              즐겨찾기한 영화가 없어요.
            </p>
          ) : isMoviesPending ? (
            <p className="py-10 text-center text-sm text-slate-500">
              불러오는 중...
            </p>
          ) : (
            <>
              <MovieGrid movies={movies} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}