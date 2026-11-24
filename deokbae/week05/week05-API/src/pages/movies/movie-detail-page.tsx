import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import "../../App.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function formatRuntime(minutes: number | null) {
  if (minutes === null || minutes <= 0) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    // 유효하지 않으면 API를 호출하지 않음
    if (!isValidMovieId) return;

    let ignore = false;

    setIsLoading(true);
    setErrorMessage(null);
    setMovie(null);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("영화 정보를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);

  // 훅은 전부 위에서 호출한 뒤, 아래에서 상태별로 분기
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">
        불러오는 중...
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main
        role="alert"
        className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600"
      >
        {errorMessage ?? "영화를 찾을 수 없어요."}
      </main>
    );
  }

  const genreText = movie.genres.map((genre) => genre.name).join(", ");
 const runtimeText = formatRuntime(movie.runtime);

  return (
    <main className="bg-slate-50">
      {/* 히어로 */}
      <section className="relative h-[300px] overflow-hidden bg-slate-800">
        {movie.backdrop_path && (
          <img
            src={`${IMAGE_BASE_URL}/w1280${movie.backdrop_path}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-12 py-6 text-white">
          <Link to="/" className="flex w-fit items-center gap-1 text-xs">
            <span aria-hidden="true">‹</span>
            영화 목록
          </Link>

          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-1 text-xs">{movie.original_title}</p>
            <p className="mt-2 text-xs">
            <span className="font-bold">{movie.release_date}</span>
            {genreText && <span className="ml-2">{genreText}</span>}
            </p>
            <p className="mt-1 text-xs">{runtimeText}</p>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_260px] px-12 py-8">
        <div className="flex gap-5 pr-8">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}/w342${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              className="h-[186px] w-[130px] shrink-0 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-[186px] w-[130px] shrink-0 items-center justify-center rounded-lg bg-slate-200 text-[10px] text-slate-500">
              이미지 없음
            </div>
          )}

          <div>
            {movie.tagline && (
              <h2 className="text-lg font-bold text-slate-900">{movie.tagline}</h2>
            )}
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              {movie.overview}
            </p>
            <button
              type="button"
              onClick={() => toggleBookmark(movie.id)}
              className={cn(
                "mt-4 flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold text-white",
                isBookmarked ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700",
              )}
            >
              <span aria-hidden="true">🔖</span>
              즐겨찾기
            </button>
          </div>
        </div>

        <aside className="border-l border-slate-200 pl-8">
          <h2 className="text-lg font-bold text-slate-900">내 평점</h2>
          <p className="mt-1 text-[10px] text-slate-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="mt-3 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n}점`}
                onClick={() => setRating(n)}
                className="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white"
              >
                <span
                  className={cn(
                    "text-lg",
                    n <= rating ? "text-yellow-400" : "text-slate-500",
                  )}
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-[68px] w-full resize-none rounded-md border border-slate-200 bg-white p-3 text-xs placeholder:text-slate-400"
          />

          <button
            type="button"
            className="mt-2 w-full rounded-md bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}