import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { id, title, releaseDate, posterPath } = movie;

  return (
    <article>
      <div className="relative aspect-[242/274] overflow-hidden rounded-lg bg-gray-300">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(id) }}
          className="block size-full"
        >
          <img
            className="size-full object-cover"
            src={posterPath}
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
      <p className="mt-0.5 text-xs leading-4 text-ink-muted">{releaseDate}</p>
    </article>
  );
}
