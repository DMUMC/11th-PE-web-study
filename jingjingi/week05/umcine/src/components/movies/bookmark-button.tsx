import type { MouseEvent } from "react";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 3.8A1.8 1.8 0 0 1 7.8 2h8.4A1.8 1.8 0 0 1 18 3.8V22l-6-3.8L6 22V3.8Z" />
    </svg>
  );
}

export function BookmarkButton({
  movieId,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleBookmark(movieId);
  }

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm font-bold transition",
        variant === "icon" && "grid size-8 place-items-center rounded-lg text-white shadow-sm",
        variant === "icon" &&
          (isBookmarked
            ? "bg-brand-600 hover:bg-brand-500"
            : "bg-black/65 hover:bg-black/80"),
        variant === "text" && "rounded-lg px-5 py-3",
        variant === "text" &&
          (isBookmarked
            ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
            : "bg-brand-600 text-white hover:bg-brand-500"),
        className,
      )}
    >
      <BookmarkIcon filled={isBookmarked} />
      {variant === "text" && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
