"use client";
import { useRouter } from "next/navigation";
import { useAddFavoriteMutation } from "@/hooks/use-add-favorite-mutation";
import { useFavoritesQuery } from "@/hooks/use-favorites-query";
import { useRemoveFavoriteMutation } from "@/hooks/use-remove-favorite-mutation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();

  const isBookmarked =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ??
    false;
  const isPending = addMutation.isPending || removeMutation.isPending;

   const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      router.push("/login");      
      return
    }
    if (isPending) return;

    if (isBookmarked) {
      removeMutation.mutate(movieId);
    } else {
      addMutation.mutate({ movieId });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 disabled:cursor-not-allowed",
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