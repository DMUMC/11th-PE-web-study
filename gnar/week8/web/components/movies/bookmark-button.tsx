import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { addFavorite, deleteFavorite, getFavorite, getFavorites } from "../../api/cinema-api";
import { getApiErrorMessage } from "../../api/member-api";
import { favoritesKey } from "../../hooks/use-member";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({
  movieId, movieTitle, variant = "text", className,
}: BookmarkButtonProps) {
  const token = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const key = favoritesKey(token ?? "");
  const detail = variant === "text";
  const list = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => getFavorites(token!, signal),
    enabled: Boolean(token) && !detail,
    staleTime: 30_000,
  });
  const favorite = useQuery({
    queryKey: [...key, movieId],
    queryFn: ({ signal }) => getFavorite(token!, movieId, signal),
    enabled: Boolean(token) && detail,
  });
  const query = detail ? favorite : list;
  const isBookmarked = detail
    ? favorite.data === true
    : list.data?.some((item) => (typeof item === "number" ? item : item.movieId) === movieId) ?? false;
  const mutation = useMutation({
    mutationFn: (remove: boolean) => remove ? deleteFavorite(token!, movieId) : addFavorite(token!, movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
  const classes = cn(
    "inline-flex items-center justify-center font-semibold shadow disabled:opacity-60",
    detail ? "gap-2 rounded-lg px-4 py-2 text-sm" : "size-10 rounded-full text-xl",
    isBookmarked ? "bg-blue-600 text-white" : "bg-black/60 text-white",
    className,
  );

  if (!token) {
    return (
      <Link to="/login" className={classes} aria-label="로그인 후 즐겨찾기 추가">
        ☆ {detail && "로그인하고 즐겨찾기"}
      </Link>
    );
  }

  const error = mutation.error ?? query.error;
  const label = isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가";
  return (
    <>
      <button type="button" aria-label={`${movieTitle} ${label}`} aria-pressed={isBookmarked}
        disabled={query.isPending || query.isError || mutation.isPending}
        onClick={() => mutation.mutate(isBookmarked)} className={classes}
        title={error ? getApiErrorMessage(error) : label}>
        <span aria-hidden="true">{isBookmarked ? "★" : "☆"}</span>
        {detail && (mutation.isPending ? "저장 중…" : label)}
      </button>
      {detail && error && <p role="alert">{getApiErrorMessage(error)}</p>}
    </>
  );
}
