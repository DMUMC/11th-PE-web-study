import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-xl font-semibold text-slate-700">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900 shadow-xl">
        <img src={movie.backdropPath} alt="" aria-hidden="true" className="h-[360px] w-full object-cover brightness-50 sm:h-[420px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="h-48 w-32 rounded-2xl border border-white/20 object-cover shadow-lg sm:h-60 sm:w-40"
            />

            <div className="max-w-3xl text-white">
              <Link to="/" className="mb-3 inline-flex text-sm text-slate-200 hover:text-white">
                ← 영화 목록
              </Link>
              <h1 className="text-2xl font-bold sm:text-4xl">{movie.title}</h1>
              <p className="mt-2 text-sm text-slate-200 sm:text-base">{movie.originalTitle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-200 sm:text-sm">
                <span>{movie.releaseDate}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span>{movie.genres.join(" · ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">줄거리</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">{movie.overview}</p>
          <p className="mt-6 text-lg font-semibold text-slate-900">{movie.tagline}</p>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">영화 정보</h3>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between gap-4">
              <dt>원제</dt>
              <dd className="text-right text-slate-800">{movie.originalTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>개봉일</dt>
              <dd className="text-right text-slate-800">{movie.releaseDate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>장르</dt>
              <dd className="text-right text-slate-800">{movie.genres.join(", ")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>상영 시간</dt>
              <dd className="text-right text-slate-800">{movie.runtime}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}