"use client";

import Link from "next/link";
import type { TmdbMovie } from "../../api/movies/models";
import { useFavoritesQuery } from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";
import { MoviePoster } from "./movie-poster";

interface MovieCardProps {
  movie: TmdbMovie;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const { id, title, release_date, poster_path } = movie;
  // 카드마다 부르지만 같은 key라 즐겨찾기 목록 요청은 한 번만 나간다.
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  // 토큰을 읽기 전에는 서버 HTML과 같게 해제 상태로 그린다.
  const isBookmarked =
    Boolean(accessToken) &&
    (favoritesQuery.data?.some((favorite) => favorite.movieId === id) ?? false);

  return (
    <article>
      <div className="relative aspect-[242/274] overflow-hidden rounded-lg bg-gray-300">
        <Link href={`/movies/${id}`} className="block size-full">
          <MoviePoster
            className="size-full"
            src={getTmdbPosterUrl(poster_path)}
            alt={`${title} 포스터`}
            sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
            priority={priority}
          />
        </Link>
        <BookmarkButton
          movieId={id}
          title={title}
          isBookmarked={isBookmarked}
          className="absolute right-2.5 top-2.5"
        />
      </div>
      <h2 className="mt-[7px] truncate text-sm font-bold leading-5">
        <Link href={`/movies/${id}`}>
          {title}
        </Link>
      </h2>
      <p className="mt-0.5 text-xs leading-4 text-ink-muted">
        {formatReleaseDate(release_date)}
      </p>
    </article>
  );
}
