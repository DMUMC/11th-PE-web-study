import { useBookmarkStore } from "../stores/bookmark-store";

export default function BookmarkButton({ movieId }: { movieId: number }) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button type="button" onClick={() => toggleBookmark(movieId)}>
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt={isBookmarked ? "찜 해제" : "찜하기"}
        width={24}
        height={24}
      />
    </button>
  );
}
