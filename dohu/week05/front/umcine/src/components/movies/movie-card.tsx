import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";
import { MoviePoster } from "./movie-poster";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { id, title, release_date, poster_path } = movie;

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
