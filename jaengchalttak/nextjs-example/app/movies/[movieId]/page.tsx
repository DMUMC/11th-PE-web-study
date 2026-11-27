import { Suspense } from "react";
import { MovieDetailPage } from "@/src/screens/movies/movie-detail-page";

export default function Page({ params }: PageProps<"/movies/[movieId]">) {
  return (
    <Suspense fallback={<main role="status" className="p-8">영화 정보를 불러오는 중이에요.</main>}>
      <MovieScreen params={params} />
    </Suspense>
  );
}

async function MovieScreen({ params }: Pick<PageProps<"/movies/[movieId]">, "params">) {
  const { movieId } = await params;
  return <MovieDetailPage movieIdParam={movieId} />;
}
