import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

interface BookmarkButtonProps {
  movieId: number;
  title: string;
  variant?: "icon" | "label";
  className?: string;
}

export function BookmarkButton({
  movieId,
  title,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const iconName = isBookmarked ? "bookmark" : "bookmark-outline";

  if (variant === "label") {
    return (
      <button
        type="button"
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-bold text-white hover:bg-primary-dark",
          className,
        )}
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movieId)}
      >
        <Icon name={iconName} className="size-5" />
        즐겨찾기
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "flex size-[34px] items-center justify-center rounded-md border-[1.5px] text-white",
        isBookmarked ? "border-primary bg-primary" : "border-white bg-gray-900/75",
        className,
      )}
      aria-label={isBookmarked ? `${title} 북마크 해제` : `${title} 북마크`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <Icon name={iconName} />
    </button>
  );
}
