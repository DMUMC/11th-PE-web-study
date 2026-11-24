import { Link } from "@tanstack/react-router";

import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block overflow-hidden"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-full object-cover transition-transform hover:scale-105"
          />
        </Link>

        <button
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute right-3 top-3 flex size-10 cursor-pointer items-center justify-center rounded-full text-xl shadow transition-colors",
            movie.isBookmarked
              ? "bg-blue-600 text-white"
              : "bg-black/60 text-white hover:bg-black/80",
          )}
        >
          {movie.isBookmarked ? "★" : "☆"}
        </button>
      </div>

      <div className="space-y-2 p-4">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block hover:text-blue-600"
        >
          <h2 className="text-base font-bold">{movie.title}</h2>
        </Link>

        <p className="text-sm text-slate-500">
          {movie.originalTitle}
        </p>

        <p className="text-sm text-slate-500">
          {movie.releaseDate}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;