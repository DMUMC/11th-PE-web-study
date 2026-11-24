import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const detailLink = { to: "/movies/$movieId" as const, params: { movieId: String(movie.id) } };

  return (
    <article className="min-w-0">
      <div className="relative aspect-252/274 w-full overflow-hidden rounded-[9px] bg-[#e3e6eb]">
        <Link {...detailLink} className="block size-full" aria-label={`${movie.title} 상세 보기`}>
          <img className="size-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          className={cn(
            "absolute right-2.5 top-2.5 flex size-8.75 items-center justify-center rounded-lg border border-white/90",
            movie.isBookmarked ? "bg-[#2864dc]" : "bg-[rgba(24,26,29,0.82)]",
          )}
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-5 brightness-0 invert"
            src={`/icons/movie-icons/${movie.isBookmarked ? "bookmark" : "bookmark-outline"}.svg`}
            alt=""
          />
        </button>
      </div>
      <div className="pt-2">
        <h2 className="truncate text-sm leading-5 font-semibold text-[#202124]">
          <Link {...detailLink} className="hover:underline">{movie.title}</Link>
        </h2>
        <p className="mt-px text-xs leading-4.5 text-[#9299a4]">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
