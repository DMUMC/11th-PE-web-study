import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { Icon } from "../../components/common/icon";
import { StatusMessage } from "../../components/common/status-message";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { useFavoriteStatusQuery } from "../../hooks/use-favorites";
import { MyRatingSection } from "../../components/movies/my-rating-section";
import {
  formatReleaseDate,
  formatRuntime,
} from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

interface MovieDetailContentProps {
  movieId: number;
}

function MovieDetailContent({ movieId }: MovieDetailContentProps) {
  // 상세 정보는 자주 바뀌지 않지만 연습으로 전역 기본값 1분 대신 30초를 준다.
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 30 * 1000,
  });
  const favoriteStatusQuery = useFavoriteStatusQuery(movieId);

  if (movieDetailQuery.isPending) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage>영화 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage tone="error">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </StatusMessage>
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const genres = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main className="flex-1">
      <section className="relative h-[360px] overflow-hidden bg-gray-900 text-white">
        <MoviePoster
          className="absolute inset-0 size-full object-[center_22%]"
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt={`${movie.title} 배경 이미지`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-6 pt-7 lg:px-20">
          <Link
            to="/"
            className="flex items-center gap-1 self-start text-[13px] font-bold"
          >
            <Icon name="chevron-left" className="size-5" />
            영화 목록
          </Link>
          <div className="mt-auto">
            <h1 className="text-3xl font-extrabold tracking-[-0.88px] lg:text-[44px] lg:leading-[56px]">
              {movie.title}
            </h1>
            <p className="mt-2 text-[15px] text-white/85">
              {movie.original_title}
            </p>
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
        />

        <section className="min-w-0 flex-1 pt-1">
          {movie.tagline && (
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
          )}
          <p className="mt-3 text-sm leading-6 text-ink-sub">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
          <BookmarkButton
            movieId={movie.id}
            title={movie.title}
            isBookmarked={favoriteStatusQuery.data ?? false}
            variant="label"
            className="mt-4"
          />
        </section>

        <MyRatingSection movieId={movie.id} />
      </div>
    </main>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  // 올바르지 않은 영화 번호는 요청하지 않는다.
  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return (
      <main className="flex-1 px-5">
        <StatusMessage>올바르지 않은 영화 번호예요.</StatusMessage>
      </main>
    );
  }

  return <MovieDetailContent movieId={parsedMovieId} />;
}
