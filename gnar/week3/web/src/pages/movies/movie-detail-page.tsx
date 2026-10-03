import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const movie = movies.find(
    (item) => item.id === Number(movieId),
  );

  if (!movie) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-4 text-2xl font-bold">
          영화를 찾을 수 없어요.
        </h1>

        <Link to="/" className="text-blue-600 hover:underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main>
      <div className="relative h-64 overflow-hidden bg-slate-900 md:h-96">
        <img
            key={movie.backdropPath}
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            onError={(event) => {
                const image = event.currentTarget;

                if (image.dataset.fallbackApplied === "true") {
                return;
                }

                image.dataset.fallbackApplied = "true";
                image.src = movie.posterPath;
            }}
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-8 text-white">
          <p className="mb-2 text-sm">{movie.originalTitle}</p>
          <h1 className="text-3xl font-bold md:text-5xl">
            {movie.title}
          </h1>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <Link
          to="/"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          ← 영화 목록
        </Link>

        <div className="flex flex-col items-start gap-8 md:flex-row">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-52 shrink-0 rounded-xl shadow-lg md:w-64"
          />

          <div className="min-w-0 space-y-5">
            <h2 className="text-2xl font-bold">{movie.title}</h2>

            <p className="text-slate-500">{movie.originalTitle}</p>

            <dl className="space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="font-semibold">개봉일</dt>
                <dd>{movie.releaseDate}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="font-semibold">상영 시간</dt>
                <dd>{movie.runtime}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="shrink-0 font-semibold">장르</dt>
                <dd>{movie.genres.join(" · ")}</dd>
              </div>
            </dl>

            <p className="text-lg font-semibold text-blue-600">
              {movie.tagline}
            </p>

            <h3 className="text-xl font-bold">줄거리</h3>

            <p className="whitespace-pre-line leading-8 text-slate-700">
              {movie.overview}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}