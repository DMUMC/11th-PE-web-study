import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [rating, setRating] = useState(0);

  if (!movie) {
    return (
      <main className="grid min-h-[calc(100vh-8rem)] place-items-center bg-slate-50 px-6 text-center">
        <div>
          <p className="text-6xl font-black text-slate-200">404</p>
          <h1 className="mt-4 text-2xl font-black text-slate-950">영화를 찾을 수 없어요.</h1>
          <Link to="/" className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white">
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
        <div className="mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-5 pb-12 pt-24 sm:px-8">
          <Link to="/" className="mb-8 w-fit text-sm font-semibold text-white/75 hover:text-white">
            ← 영화 목록
          </Link>
          <p className="text-sm font-bold text-brand-500">{movie.genres.join(" · ")}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{movie.title}</h1>
          <p className="mt-3 text-sm text-white/70">
            {movie.originalTitle} · {movie.releaseDate} · {movie.runtime}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[220px_1fr_320px]">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="-mt-24 hidden w-full rounded-xl object-cover shadow-xl lg:block"
        />

        <div>
          <p className="text-sm font-bold text-brand-600">작품 소개</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{movie.tagline}</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">{movie.overview}</p>

          <button type="button" className="mt-7 rounded-lg bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-500">
            북마크
          </button>
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
          <button type="button" className="mt-3 w-full rounded-lg bg-slate-950 py-3 text-sm font-bold text-white hover:bg-slate-800">
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}
