import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  className?: string;
  variant?: "badge" | "button";
}

export function BookmarkButton({ movieId, className, variant = "button" }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  if (variant === "badge") {
    return (
      <button
        type="button"
        aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        className={cn(
          "rounded-full p-2 text-white text-xs cursor-pointer transition-colors flex items-center justify-center gap-1",
          isBookmarked ? "bg-blue-600 hover:bg-blue-700" : "bg-black/60 hover:bg-black/80",
          className,
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(movieId);
        }}
      >
        <span>{isBookmarked ? "★ 북마크됨" : "☆ 북마크"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "rounded-[6px] px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
        isBookmarked
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(movieId);
      }}
    >
      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}

export default BookmarkButton;
