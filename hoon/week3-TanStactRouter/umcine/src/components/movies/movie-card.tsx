import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full overflow-hidden rounded-[8px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block aspect-[2/3] w-full object-cover transition-transform duration-300 hover:scale-105"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>
        <button
          type="button"
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 text-white text-xs cursor-pointer transition-colors",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60 hover:bg-black/80",
          )}
          onClick={() => onToggleBookmark(movie.id)}
        >
          북마크
        </button>
      </div>
      <div className="p-2">
        <h3 className="mt-[10px] mb-1 text-sm font-semibold truncate">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            className="text-gray-900 hover:text-[#5267e9] transition-colors"
          >
            {movie.title}
          </Link>
        </h3>
        <p className="m-0 text-xs text-[#8a8a8a]">{movie.releaseDate}</p>
      </div>
    </div>
  );
}

export default MovieCard;
