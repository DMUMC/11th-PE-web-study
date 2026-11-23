import { Suspense } from "react";
import { MovieDetailPage } from "@/views/movies/movie-detail-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">
          불러오는 중...
        </main>
      }
    >
      <MovieDetailPage />
    </Suspense>
  );
}