import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movie";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";
import "../../App.css";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [rating, setRating] = useState(0);

  const isBookmarked = useBookmarkStore((state) =>
    movie ? state.bookmarkedMovieIds.includes(movie.id) : false,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (!movie) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="bg-slate-50">
      {/* 히어로 */}
      <section className="relative h-[300px] overflow-hidden bg-slate-800">
        {movie.backdropPath && (
          <img
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
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
            <p className="mt-1 text-xs">{movie.originalTitle}</p>
            <p className="mt-2 text-xs">
              <span className="font-bold">{movie.releaseDate}</span>
              <span className="ml-2">
                {movie.genres.join(" · ")} · {movie.runtime}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_260px] px-12 py-8">
        <div className="flex gap-5 pr-8">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-[186px] w-[130px] shrink-0 rounded-lg object-cover shadow-lg"
          />

          <div>
            <h2 className="text-lg font-bold text-slate-900">{movie.tagline}</h2>
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

        {/* 내 평점 */}
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