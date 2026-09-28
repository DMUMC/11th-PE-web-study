import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col">
  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#ddd]">
    <img
      src={movie.posterPath}
      alt={movie.title}
      className="w-full h-full object-cover block"
    />

    <button
      className={cn(
        "absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0",
        movie.isBookmarked ? "bg-blue-600" : "bg-white",
      )}
      aria-pressed={movie.isBookmarked}
      aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={() => onToggleBookmark(movie.id)}
    >
      <img
        src={
          movie.isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        className="h-3.5 w-3.5"
      />
    </button>
  </div>

  <Link
    to="/movies/$movieId"
    params={{ movieId: String(movie.id) }}
  >
    <h3 className="mt-2.5 mb-0.5 text-sm font-semibold text-[#111] whitespace-nowrap overflow-hidden text-ellipsis text-left">
      {movie.title}
    </h3>
  </Link>

  <p className="m-0 text-xs text-[#888] text-left">
    {movie.releaseDate}
  </p>
</article>
  );
}

export default MovieCard;