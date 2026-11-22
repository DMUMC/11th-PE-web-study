import { useNavigate } from "@tanstack/react-router";
import { getApiErrorMessage } from "../../api/api-client";
import { useFavorites, useFavoriteStatus, useToggleFavorite } from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
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
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isCard = variant === "icon";
  const favorites = useFavorites(isCard);
  const favoriteStatus = useFavoriteStatus(movieId, !isCard);
  const query = isCard ? favorites : favoriteStatus;
  const isBookmarked = isCard
    ? favorites.data?.some((favorite) => favorite.movieId === movieId) ?? false
    : favoriteStatus.data ?? false;
  const toggleFavorite = useToggleFavorite(movieId);
  const action = query.isError && accessToken
    ? "즐겨찾기 다시 불러오기"
    : isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가";
  const disabled = Boolean(accessToken) && (query.isFetching || toggleFavorite.isPending);
  const error = toggleFavorite.error ?? query.error;

  function handleClick() {
    if (!accessToken) void navigate({ to: "/login" });
    else if (query.isError) void query.refetch();
    else if (query.isSuccess) toggleFavorite.mutate(isBookmarked);
  }

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={`${movieTitle} ${action}`}
        aria-pressed={isBookmarked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center font-semibold shadow transition-colors disabled:cursor-wait disabled:opacity-60",
          isCard ? "size-10 rounded-full text-xl" : "gap-2 rounded-lg px-4 py-2 text-sm",
          isBookmarked
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-black/60 text-white hover:bg-black/80",
        )}
      >
        <span aria-hidden="true">{isBookmarked ? "★" : "☆"}</span>
        {!isCard && action}
      </button>
      {accessToken && error && (!isCard || toggleFavorite.isError) && (
        <p role="alert" className={cn("mt-2 text-sm text-red-700",
          isCard && "max-w-44 rounded bg-white px-2 py-1 shadow")}>
          {getApiErrorMessage(error)}
        </p>
      )}
    </div>
  );
}
