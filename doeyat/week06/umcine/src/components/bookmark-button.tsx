import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle?: string;
  className?: string;
}

export function BookmarkButton({ movieId, movieTitle, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "flex size-8.75 items-center justify-center rounded-lg border border-white/90 transition-colors",
        isBookmarked ? "bg-[#2864dc]" : "bg-[rgba(24,26,29,0.82)]",
        className,
      )}
      type="button"
      aria-label={movieTitle ? `${movieTitle} 북마크` : "북마크"}
      aria-pressed={isBookmarked}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleBookmark(movieId);
      }}
    >
      <img
        className="size-5 brightness-0 invert"
        src={`/icons/movie-icons/${isBookmarked ? "bookmark" : "bookmark-outline"}.svg`}
        alt=""
      />
    </button>
  );
}