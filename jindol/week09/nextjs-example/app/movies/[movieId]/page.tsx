import { Suspense } from "react";
import { MovieDetailPage } from "../../../src/page-components/movies/movie-detail-page";

export default function MoviePage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-4 py-16 text-center" aria-live="polite">
          <p className="text-xl font-semibold text-slate-700">
            영화 정보를 불러오는 중이에요...
          </p>
        </main>
      }
    >
      {params.then(({ movieId }) => (
        <MovieDetailPage movieIdParam={movieId} />
      ))}
    </Suspense>
  );
}
