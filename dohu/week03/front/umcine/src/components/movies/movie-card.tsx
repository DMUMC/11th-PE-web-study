import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

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
        <button
          type="button"
          className={cn(
            "absolute right-2.5 top-2.5 flex size-[34px] items-center justify-center rounded-md border-[1.5px] text-white",
            isBookmarked
              ? "border-primary bg-primary"
              : "border-white bg-gray-900/75",
          )}
          aria-label={isBookmarked ? `${title} 북마크 해제` : `${title} 북마크`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <Icon name={isBookmarked ? "bookmark" : "bookmark-outline"} />
        </button>
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
