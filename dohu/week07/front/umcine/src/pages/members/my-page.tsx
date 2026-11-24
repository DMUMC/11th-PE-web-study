import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { StatusMessage } from "../../components/common/status-message";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { SAMPLE_PROFILE } from "../../config/sample-profile";
import { useBookmarkStore } from "../../stores/bookmark-store";

const FAVORITES_PER_PAGE = 10;

function FavoriteMovies() {
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [currentPage, setCurrentPage] = useState(1);

  // 최근에 담은 영화부터 보여 준다.
  const movieIds = [...bookmarkedMovieIds].reverse();
  const totalPages = Math.max(1, Math.ceil(movieIds.length / FAVORITES_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const pageMovieIds = movieIds.slice(
    (page - 1) * FAVORITES_PER_PAGE,
    page * FAVORITES_PER_PAGE,
  );

  // 상세 화면과 같은 key를 써서 이미 본 영화는 캐시를 그대로 쓴다.
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30 * 1000,
    })),
  });

  if (movieIds.length === 0) {
    return (
      <StatusMessage className="py-14">
        아직 즐겨찾기한 영화가 없어요. 영화 카드의 북마크를 눌러 담아 보세요.
      </StatusMessage>
    );
  }

  if (movieQueries.some((query) => query.isPending)) {
    return <MovieGridSkeleton />;
  }

  const movies = movieQueries.flatMap((query) => (query.data ? [query.data] : []));

  return (
    <>
      {movies.length < pageMovieIds.length && (
        <p role="alert" className="mt-3 text-xs text-danger">
          일부 영화 정보를 불러오지 못했어요.
        </p>
      )}
      <MovieGrid movies={movies} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

export function MyPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-[54px] pt-6 lg:px-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold leading-[44px] tracking-[-0.72px]">내 정보</h1>
        <Link
          to="/me/edit"
          className="flex h-10 items-center rounded-md bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark"
        >
          정보 수정
        </Link>
      </div>

      <section className="mt-6 border-t border-line pt-5">
        <h2 className="text-base font-bold">기본 정보</h2>
        <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line pb-6">
          <ProfileAvatar />
          <div className="min-w-[160px] flex-1">
            <dt className="text-xs text-ink-muted">닉네임</dt>
            <dd className="mt-1 text-sm font-bold">{SAMPLE_PROFILE.nickname}</dd>
          </div>
          <div className="min-w-[160px] flex-[2]">
            <dt className="text-xs text-ink-muted">이메일</dt>
            <dd className="mt-1 text-sm font-bold">{SAMPLE_PROFILE.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-bold">내 즐겨찾기</h2>
        <FavoriteMovies />
      </section>
    </main>
  );
}
