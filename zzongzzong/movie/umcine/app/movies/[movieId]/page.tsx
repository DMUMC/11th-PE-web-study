import { Suspense } from "react";
import { MovieDetailPage } from "../../../src/screens/movies/movie-detail-page";

export default function MovieRoute() {
  return (
    <Suspense fallback={<p role="status">영화 정보를 준비하고 있어요.</p>}>
      <MovieDetailPage />
    </Suspense>
  );
}
