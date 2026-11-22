import { Suspense } from "react";
import { StatusMessage } from "@/components/common/status-message";
import { MovieGrid, MovieGridSkeleton } from "@/components/movies/movie-grid";
import { Pagination } from "@/components/movies/pagination";
import { getPopularMovies } from "@/lib/tmdb";

// TMDB 인기 영화는 500페이지까지 있지만 화면에서는 5페이지까지만 보여 준다.
const MAX_PAGES = 5;

function toPage(value: string | string[] | undefined) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  if (!Number.isInteger(page) || page < 1) return 1;
  return Math.min(page, MAX_PAGES);
}

// 제목과 레이아웃은 미리 만들어 두고, 주소의 page를 알아야 하는 목록만 요청 시점에 채운다.
export default function MovieListPage({ searchParams }: PageProps<"/">) {
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-[54px] pt-6 lg:px-20">
      <h1 className="text-4xl font-bold leading-[44px] tracking-[-0.72px]">영화 목록</h1>
      <Suspense fallback={<MovieGridSkeleton />}>
        <MovieList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function MovieList({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { page } = await searchParams;
  const currentPage = toPage(page);

  // 실패하면 오류를 던지지 않고 null로 받아 이 자리에만 안내를 보여 준다.
  const data = await getPopularMovies(currentPage).catch(() => null);

  if (!data) {
    return <StatusMessage tone="error">영화 목록을 불러오지 못했어요.</StatusMessage>;
  }
  if (data.results.length === 0) {
    return <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>;
  }

  const totalPages = Math.min(data.total_pages, MAX_PAGES);

  return (
    <>
      <MovieGrid movies={data.results} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        getHref={(nextPage) => (nextPage === 1 ? "/" : `/?page=${nextPage}`)}
      />
    </>
  );
}
