import { cn } from "../../utils/cn";
import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

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
            isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
          onClick={() => toggleBookmark(movie.id)}
        >
          {isBookmarked ? "북마크 해제" : "북마크 추가"}
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