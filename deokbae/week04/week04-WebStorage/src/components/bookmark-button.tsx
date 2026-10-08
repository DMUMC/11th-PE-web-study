import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn"; 

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0",
        isBookmarked ? "bg-blue-600" : "bg-white",
      )}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
    >
      <img
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        className="h-3.5 w-3.5"
      />
    </button>
  );
}