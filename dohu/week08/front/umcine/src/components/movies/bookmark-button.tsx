import { useToggleFavoriteMutation } from "../../hooks/use-favorites";
import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

interface BookmarkButtonProps {
  movieId: number;
  title: string;
  // 목록은 GET /favorites, 상세는 GET /favorites/{movieId}로 상태를 알아서 부모가 넘겨준다.
  isBookmarked: boolean;
  variant?: "icon" | "label";
  className?: string;
}

export function BookmarkButton({
  movieId,
  title,
  isBookmarked,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const { toggle, isPending } = useToggleFavoriteMutation();
  const toggleBookmark = (id: number) => toggle({ movieId: id, isFavorite: isBookmarked });
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
        disabled={isPending}
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
      disabled={isPending}
      onClick={() => toggleBookmark(movieId)}
    >
      <Icon name={iconName} />
    </button>
  );
}
