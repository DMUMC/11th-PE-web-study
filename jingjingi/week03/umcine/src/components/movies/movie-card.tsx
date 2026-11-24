import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 3.8A1.8 1.8 0 0 1 7.8 2h8.4A1.8 1.8 0 0 1 18 3.8V22l-6-3.8L6 22V3.8Z" />
    </svg>
  );
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-xl bg-slate-200 shadow-sm">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>

        <button
          type="button"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
          onClick={() => setIsBookmarked((current) => !current)}
          className={cn(
            "absolute right-2 top-2 grid size-8 place-items-center rounded-lg text-white shadow-sm transition",
            isBookmarked
              ? "bg-brand-600 hover:bg-brand-500"
              : "bg-black/65 hover:bg-black/80",
          )}
        >
          <BookmarkIcon filled={isBookmarked} />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="mt-3 block truncate text-sm font-bold text-slate-900 hover:text-brand-600"
      >
        {movie.title}
      </Link>
      <p className="mt-1 text-xs text-slate-500">{movie.releaseDate}</p>
    </article>
  );
}
