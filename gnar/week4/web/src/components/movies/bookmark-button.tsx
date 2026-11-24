import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "text",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center font-semibold shadow transition-colors",
        variant === "icon"
          ? "size-10 rounded-full text-xl"
          : "gap-2 rounded-lg px-4 py-2 text-sm",
        isBookmarked
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-black/60 text-white hover:bg-black/80",
        className,
      )}
    >
      <span aria-hidden="true">{isBookmarked ? "★" : "☆"}</span>
      {variant === "text" && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
