import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { cn } from "../../utils/cn";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    isValidMovieId ? null : "올바르지 않은 영화 번호예요.",
  );
  const [retryCount, setRetryCount] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setMovie(null);

    if (!isValidMovieId) {
      setIsLoading(false);
      setErrorMessage("올바르지 않은 영화 번호예요.");
      return () => controller.abort();
    }

    setIsLoading(true);
    setErrorMessage(null);

    getMovieDetail(parsedMovieId, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          setMovie(response);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isValidMovieId, parsedMovieId, retryCount]);

  if (isLoading) {
    return (
      <main className="grid min-h-[calc(100vh-8rem)] place-items-center bg-slate-50 px-6 text-center">
        <p className="text-base font-semibold text-slate-500">영화 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="grid min-h-[calc(100vh-8rem)] place-items-center bg-slate-50 px-6 text-center">
        <div>
          <p className="text-6xl font-black text-slate-200">404</p>
          <h1 className="mt-4 text-2xl font-black text-slate-950">
            {errorMessage ?? "영화를 찾을 수 없어요."}
          </h1>
          <div className="mt-6 flex justify-center gap-3">
            {isValidMovieId && (
              <button
                type="button"
                onClick={() => setRetryCount((count) => count + 1)}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                다시 시도
              </button>
            )}
            <Link
              to="/"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              영화 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(" · ");

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-5 pb-12 pt-24 sm:px-8">
          <Link to="/" className="mb-8 w-fit text-sm font-semibold text-white/75 hover:text-white">
            ← 영화 목록
          </Link>
          <p className="text-sm font-bold text-brand-500">{genreNames || "장르 정보 없음"}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {movie.title}
          </h1>
          <p className="mt-3 text-sm text-white/70">
            {movie.original_title} · {movie.release_date || "개봉일 정보 없음"} · {formatRuntime(movie.runtime)}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[220px_1fr_320px]">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="-mt-24 hidden w-full rounded-xl object-cover shadow-xl lg:block"
          />
        ) : (
          <div className="-mt-24 hidden min-h-80 place-items-center rounded-xl bg-slate-200 text-sm font-bold text-slate-500 shadow-xl lg:grid">
            이미지 없음
          </div>
        )}

        <div>
          <p className="text-sm font-bold text-brand-600">작품 소개</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">
            {movie.tagline || movie.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            TMDB 평점 {movie.vote_average.toFixed(1)} · 평가 {movie.vote_count.toLocaleString("ko-KR")}개
          </p>

          <BookmarkButton movieId={movie.id} variant="text" className="mt-7" />
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">내 평점</h2>
          <div className="mt-4 flex gap-1" aria-label="평점 선택">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setRating(score)}
                aria-label={`${score}점`}
                className={cn(
                  "text-3xl transition",
                  score <= rating ? "text-amber-400" : "text-slate-200 hover:text-amber-300",
                )}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            aria-label="영화 감상평"
            placeholder="영화에 대한 느낌을 남겨주세요."
            className="mt-5 min-h-28 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-slate-950 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}
