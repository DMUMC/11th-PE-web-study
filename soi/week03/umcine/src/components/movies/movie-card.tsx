import { cn } from "../../utils/cn";
import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-white">
      <div className="relative w-full overflow-hidden rounded-[8px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="block aspect-[2/3] w-full object-cover"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>

        <button
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 text-white",
             movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          onClick={() => onToggleBookmark(movie.id)}
        >
          북마크
        </button>
      </div>

      <h3 className="mt-[10px] mb-1 text-sm font-semibold">
        {movie.title}
      </h3>

      <p className="m-0 text-xs text-[#8a8a8a]">
        {movie.releaseDate}
      </p>
    </div>
  );
}