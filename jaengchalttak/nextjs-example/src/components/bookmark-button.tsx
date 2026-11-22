"use client";

import Image from "next/image";
import Link from "next/link";
import { useMovieFavorite } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle?: string;
  className?: string;
  detail?: boolean;
}

export function BookmarkButton(props: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (accessToken) return <ServerBookmarkButton {...props} />;
  if (props.detail) {
    return <Link href="/login" className="rounded-md border border-[#e3e6eb] px-3 py-1.5 text-sm text-[#2864dc]">로그인하고 즐겨찾기</Link>;
  }
  return <LocalBookmarkButton {...props} />;
}

function LocalBookmarkButton({ movieId, ...props }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  return <BookmarkControl {...props} isBookmarked={isBookmarked} onToggle={() => toggleBookmark(movieId)} />;
}

function ServerBookmarkButton({ movieId, detail = false, ...props }: BookmarkButtonProps) {
  const { isFavorite, isError, retry, mutation } = useMovieFavorite(movieId, detail);
  return (
    <>
      <BookmarkControl {...props} isBookmarked={Boolean(isFavorite)} disabled={isFavorite === undefined || mutation.isPending}
        onToggle={() => {
          if (isFavorite !== undefined && !mutation.isPending) mutation.mutate(isFavorite);
        }} />
      {detail && isError && <p role="alert" className="text-sm text-red-700">즐겨찾기 상태를 불러오지 못했어요.{" "}
        <button type="button" className="underline" onClick={() => void retry()}>다시 시도</button>
      </p>}
      {mutation.isError && <span role="alert" className={cn("text-xs text-red-700", !detail && "sr-only")}>즐겨찾기를 변경하지 못했어요.</span>}
    </>
  );
}

function BookmarkControl({ movieTitle, className, isBookmarked, disabled, onToggle }: Pick<BookmarkButtonProps, "movieTitle" | "className"> & {
  isBookmarked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={cn(
        "flex size-8.75 items-center justify-center rounded-lg border border-white/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        isBookmarked ? "bg-[#2864dc]" : "bg-[rgba(24,26,29,0.82)]",
        className,
      )}
      type="button"
      aria-label={movieTitle ? `${movieTitle} 북마크` : "북마크"}
      aria-pressed={isBookmarked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggle();
      }}
    >
      <Image width={20} height={20} unoptimized
        className="size-5 brightness-0 invert"
        src={`/icons/movie-icons/${isBookmarked ? "bookmark" : "bookmark-outline"}.svg`}
        alt=""
      />
    </button>
  );
}
