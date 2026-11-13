import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/model";

interface MovieCardProps {
  movie: TmdbMovieListItem;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: number) => void;
  variant?: "grid" | "search";
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({
  movie,
  isBookmarked = false,
  onToggleBookmark,
  variant = "grid",
}: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  if (variant === "search") {
    return (
      <article className="flex min-h-[240px] w-full gap-5 border-t border-[#E3E6EB] py-5 font-[Pretendard,sans-serif]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="shrink-0"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-[190px] w-[126px] rounded-[10px] object-cover"
            />
          ) : (
            <div className="flex h-[190px] w-[126px] items-center justify-center rounded-[10px] bg-[#E3E6EB] text-xs text-[#969DA8]">
              이미지 없음
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(movie.id) }}
              className="w-fit no-underline"
            >
              <h3 className="m-0 text-[18px] font-bold leading-6 text-[#17191E]">
                {movie.title}
              </h3>
            </Link>

            <button
              type="button"
              aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
              aria-pressed={isBookmarked}
              onClick={() => onToggleBookmark?.(movie.id)}
              className={`flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-lg border ${
                isBookmarked
                  ? "border-[#2563EB] bg-[#2563EB]"
                  : "border-[#17191E] bg-[#17191E]"
              }`}
            >
              <img
                src={
                  isBookmarked
                    ? "/movie-icons/bookmark.svg"
                    : "/movie-icons/bookmark-outline.svg"
                }
                alt=""
                className="block h-5 w-5"
              />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#969DA8]">
            <span>{movie.original_title}</span>
            <span>{movie.release_date}</span>
          </div>

          <p className="mt-3 line-clamp-2 text-[12px] font-normal leading-5 text-[#606774]">
            {movie.overview || "등록된 줄거리가 없습니다."}
          </p>

          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
            className="mt-3 flex w-fit items-center gap-2 text-xs font-extrabold text-[#2563EB] no-underline"
          >
            상세 보기
            <span aria-hidden="true" className="text-base leading-none">
              →
            </span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="w-full min-w-0 font-[Pretendard,sans-serif]">
      <div className="relative aspect-[242/274] w-full overflow-hidden rounded-[10px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#E3E6EB] text-sm text-[#969DA8]">
              이미지 없음
            </div>
          )}
        </Link>

        <button
          type="button"
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark?.(movie.id)}
          className={`absolute right-[6px] top-[7.5px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border px-[6px] py-[7.5px] ${
            isBookmarked
              ? "border-[#2563EB] bg-[#2563EB]"
              : "border-white bg-[#17191E]"
          }`}
        >
          <img
            src={
              isBookmarked
                ? "/movie-icons/bookmark.svg"
                : "/movie-icons/bookmark-outline.svg"
            }
            alt=""
            className="block h-5 w-5"
          />
        </button>
      </div>

      <div className="pt-2">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="text-inherit no-underline"
        >
          <h3 className="m-0 truncate text-sm font-bold leading-[140%] text-[#17191E]">
            {movie.title}
          </h3>
        </Link>

        <p className="mb-0 mt-1 text-xs font-normal text-[#969DA8]">
          {movie.release_date}
        </p>
      </div>
    </article>
  );
}