import { useBookmarkStore } from '../../stores/bookmark-store';
import { cn } from '../../utils/cn';

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        'grid size-[29px] place-items-center rounded-[5px] border border-white/80 bg-[#121418c7] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2463cf]',
        isBookmarked && 'border-[#2878e8] bg-[#2878e8]',
        className,
      )}
      type="button"
      aria-label={`${movieTitle} ${isBookmarked ? '북마크 해제' : '북마크 추가'}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="size-[18px] invert"
        src={
          isBookmarked
            ? '/icons/bookmark.svg'
            : '/icons/bookmark-outline.svg'
        }
        alt=""
      />
    </button>
  );
}
