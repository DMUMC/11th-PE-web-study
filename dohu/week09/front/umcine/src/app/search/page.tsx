import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/common/icon";
import { StatusMessage } from "@/components/common/status-message";
import { ListBookmarkButton } from "@/components/movies/list-bookmark-button";
import { MoviePoster } from "@/components/movies/movie-poster";
import { SearchForm } from "@/components/search/search-form";
import { searchMovies } from "@/lib/tmdb";
import { formatReleaseDate } from "@/utils/movies/format-movie";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

export const metadata: Metadata = {
  title: "영화 검색",
  description: "제목으로 TMDB 영화를 검색합니다.",
};

function toQuery(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<StatusMessage>검색 화면을 준비하는 중이에요.</StatusMessage>}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchContent({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const query = toQuery((await searchParams).query);

  // 빈 검색어는 요청하지 않고 검색 안내만 보여 준다.
  if (!query) {
    return (
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-20 pt-24 text-center lg:px-20 lg:pt-[212px]">
        <h1 className="text-3xl font-extrabold tracking-[-0.8px] lg:text-[40px] lg:leading-[52px]">
          어떤 영화를 찾고 있나요?
        </h1>
        <SearchForm key="empty" initialText="" hasQuery={false} />
        <p className="mt-4 text-sm text-ink-muted">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-[54px] pt-6 lg:px-20">
      <h1 className="text-4xl font-bold leading-[44px] tracking-[-0.72px]">영화 검색</h1>
      {/* 검색어가 바뀌면 key로 다시 만들어 입력창이 주소와 같은 값으로 시작한다. */}
      <SearchForm key={`form-${query}`} initialText={query} hasQuery />
      <Suspense fallback={<StatusMessage>검색 결과를 불러오는 중이에요.</StatusMessage>}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

async function SearchResults({ query }: { query: string }) {
  const data = await searchMovies(query).catch(() => null);

  if (!data) {
    return <StatusMessage tone="error">검색 결과를 불러오지 못했어요.</StatusMessage>;
  }

  return (
    <>
      <div className="mt-5 flex items-center justify-between border-b border-line pb-4">
        <h2 className="text-base font-bold">‘{query}’ 검색 결과</h2>
        <p className="text-xs text-ink-muted">영화 {data.total_results}편</p>
      </div>
      {data.results.length === 0 ? (
        <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          {data.results.map((movie, index) => (
            <li key={movie.id} className="flex gap-[18px] border-b border-line py-5">
              <div className="relative h-[190px] w-[126px] shrink-0 overflow-hidden rounded-lg">
                <MoviePoster
                  className="size-full"
                  src={getTmdbPosterUrl(movie.poster_path)}
                  alt={`${movie.title} 포스터`}
                  sizes="126px"
                  priority={index < 2}
                />
                <ListBookmarkButton
                  movieId={movie.id}
                  title={movie.title}
                  className="absolute right-2 top-2"
                />
              </div>
              <div className="min-w-0 pt-1">
                <h3 className="text-lg font-bold leading-7">{movie.title}</h3>
                <p className="mt-1 flex flex-wrap gap-x-2.5 text-xs text-ink-muted">
                  <span>{movie.original_title}</span>
                  <span>{formatReleaseDate(movie.release_date)}</span>
                </p>
                <p className="mt-2.5 line-clamp-3 text-[13px] leading-5 text-ink-sub">
                  {movie.overview || "줄거리 정보가 없어요."}
                </p>
                <Link
                  href={`/movies/${movie.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary"
                >
                  상세 보기
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
