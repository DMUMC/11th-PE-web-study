import { Link } from "@tanstack/react-router";
import type { TmdbMovie } from "../../api/movies/models";
import { useFavoritesQuery } from "../../hooks/use-favorites";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";
import { MoviePoster } from "./movie-poster";

interface MovieCardProps {
  movie: TmdbMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { id, title, release_date, poster_path } = movie;
  // 카드마다 부르지만 같은 key라 즐겨찾기 목록 요청은 한 번만 나간다.
  const favoritesQuery = useFavoritesQuery();
  const isBookmarked =
    favoritesQuery.data?.some((favorite) => favorite.movieId === id) ?? false;

  return (
    <article>
      <div className="relative aspect-[242/274] overflow-hidden rounded-lg bg-gray-300">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(id) }}
          className="block size-full"
        >
          <MoviePoster
            className="size-full"
            src={getTmdbPosterUrl(poster_path)}
            alt={`${title} 포스터`}
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
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          {title}
        </Link>
      </h2>
      <p className="mt-0.5 text-xs leading-4 text-ink-muted">
        {formatReleaseDate(release_date)}
      </p>
    </article>
  );
}
