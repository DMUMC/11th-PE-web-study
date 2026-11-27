"use client";

import { useFavoritesQuery } from "@/hooks/use-favorites";
import { useAuthStore } from "@/stores/auth-store";
import { BookmarkButton } from "./bookmark-button";

interface ListBookmarkButtonProps {
  movieId: number;
  title: string;
  className?: string;
}

// 서버에서 그린 목록 안에 들어가는 버튼이라 즐겨찾기 여부는 브라우저에서 GET /favorites로 확인한다.
export function ListBookmarkButton({ movieId, title, className }: ListBookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  // 토큰을 읽기 전에는 서버 HTML과 같게 해제 상태로 그린다.
  const isBookmarked =
    Boolean(accessToken) &&
    (favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false);

  return (
    <BookmarkButton
      movieId={movieId}
      title={title}
      isBookmarked={isBookmarked}
      className={className}
    />
  );
}
