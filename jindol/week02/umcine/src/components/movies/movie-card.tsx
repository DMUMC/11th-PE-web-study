import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card flex flex-col">
      <div className="relative overflow-hidden rounded-xl">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="block">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="block h-[220px] w-full rounded-xl object-cover sm:h-[240px] md:h-[260px] xl:h-[280px]"
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white transition hover:bg-black/80",
            movie.isBookmarked && "bg-blue-600",
          )}
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          <img
            src={
              movie.isBookmarked
                ? "/movie-icons/bookmark-outline.svg"
                : "/movie-icons/bookmark.svg"
            }
            alt=""
            className="h-4 w-4"
          />
        </button>
      </div>

      <p className="mt-3 text-sm font-medium text-gray-900">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="transition hover:text-blue-600"
        >
          {movie.title}
        </Link>
      </p>

      <p className="mt-1 text-xs text-gray-500">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;