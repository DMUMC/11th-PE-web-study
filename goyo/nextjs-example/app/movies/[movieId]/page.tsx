import { Suspense } from "react";
import MovieDetailPage from "@/screens/movies/movie-detail-page";

interface MoviePageProps {
  params: Promise<{ movieId: string }>;
}

export default function MoviePage({ params }: MoviePageProps) {
  return (
    <Suspense fallback={<div>영화 정보를 불러오는 중이에요...</div>}>
      <MovieDetailScreen params={params} />
    </Suspense>
  );
}

async function MovieDetailScreen({ params }: MoviePageProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieId={Number(movieId)} />;
}