"use client";

import { useFavoriteStatusQuery } from "@/hooks/use-favorites";
import { useAuthStore } from "@/stores/auth-store";
import { BookmarkButton } from "./bookmark-button";

interface DetailBookmarkButtonProps {
  movieId: number;
  title: string;
  className?: string;
}

// 상세 화면은 영화 하나의 여부만 필요해서 GET /favorites/{movieId}로 확인한다.
export function DetailBookmarkButton({ movieId, title, className }: DetailBookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoriteStatusQuery = useFavoriteStatusQuery(movieId);

  return (
    <BookmarkButton
      movieId={movieId}
      title={title}
      isBookmarked={Boolean(accessToken) && (favoriteStatusQuery.data ?? false)}
      variant="label"
      className={className}
    />
  );
}
