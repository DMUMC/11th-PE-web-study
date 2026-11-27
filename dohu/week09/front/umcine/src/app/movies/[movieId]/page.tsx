import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/common/icon";
import { StatusMessage } from "@/components/common/status-message";
import { DetailBookmarkButton } from "@/components/movies/detail-bookmark-button";
import { MoviePoster } from "@/components/movies/movie-poster";
import { MyRatingSection } from "@/components/movies/my-rating-section";
import { getMovieDetail } from "@/lib/tmdb";
import { formatReleaseDate, formatRuntime } from "@/utils/movies/format-movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

function toMovieId(value: string) {
  const movieId = Number(value);
  return Number.isInteger(movieId) && movieId > 0 ? movieId : null;
}

// 영화마다 탭 제목, 설명, 공유 미리보기 이미지를 다르게 만든다. getMovieDetail은 캐시돼서 본문과 요청을 나눠 쓴다.
export async function generateMetadata({
  params,
}: PageProps<"/movies/[movieId]">): Promise<Metadata> {
  const movieId = toMovieId((await params).movieId);
  const movie = movieId ? await getMovieDetail(movieId).catch(() => null) : null;

  if (!movie) {
    return { title: "영화를 찾을 수 없어요" };
  }

  const description = movie.overview || `${movie.title}의 정보와 평점을 확인하세요.`;
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return {
    title: movie.title,
    description,
    openGraph: {
      title: `${movie.title} | UMCine`,
      description,
      images: posterUrl ? [posterUrl] : [],
    },
  };
}

export default function MovieDetailPage({ params }: PageProps<"/movies/[movieId]">) {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-5">
          <StatusMessage>영화 정보를 불러오는 중이에요.</StatusMessage>
        </main>
      }
    >
      <MovieDetail params={params} />
    </Suspense>
  );
}

async function MovieDetail({ params }: Pick<PageProps<"/movies/[movieId]">, "params">) {
  const movieId = toMovieId((await params).movieId);

  // 올바르지 않은 영화 번호는 TMDB에 요청하지 않는다.
  if (!movieId) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage>올바르지 않은 영화 번호예요.</StatusMessage>
      </main>
    );
  }

  const movie = await getMovieDetail(movieId).catch(() => undefined);

  if (movie === null) {
    notFound();
  }
  if (!movie) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage tone="error">영화 정보를 불러오지 못했어요.</StatusMessage>
      </main>
    );
  }

  const genres = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main className="flex-1">
      <section className="relative h-[360px] overflow-hidden bg-gray-900 text-white">
        <MoviePoster
          className="absolute inset-0 size-full object-[center_22%]"
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt={`${movie.title} 배경 이미지`}
          width={1280}
          height={720}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-6 pt-7 lg:px-20">
          <Link href="/" className="flex items-center gap-1 self-start text-[13px] font-bold">
            <Icon name="chevron-left" className="size-5" />
            영화 목록
          </Link>
          <div className="mt-auto">
            <h1 className="text-3xl font-extrabold tracking-[-0.88px] lg:text-[44px] lg:leading-[56px]">
              {movie.title}
            </h1>
            <p className="mt-2 text-[15px] text-white/85">{movie.original_title}</p>
            <p className="mt-2 flex flex-wrap gap-x-3 text-[13px] font-bold">
              <span>{formatReleaseDate(movie.release_date)}</span>
              {genres && <span>{genres}</span>}
              <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pb-16 pt-6 lg:flex-row lg:px-20">
        <MoviePoster
          className="h-[286px] w-[200px] shrink-0 rounded-lg shadow-lg"
          src={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
          sizes="200px"
        />

        <section className="min-w-0 flex-1 pt-1">
          {movie.tagline && <h2 className="text-xl font-bold">{movie.tagline}</h2>}
          <p className="mt-3 text-sm leading-6 text-ink-sub">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
          <DetailBookmarkButton movieId={movie.id} title={movie.title} className="mt-4" />
        </section>

        {/* 내 평점은 토큰이 있어야 알 수 있어서 브라우저에서 채운다. */}
        <MyRatingSection movieId={movie.id} />
      </div>
    </main>
  );
}
