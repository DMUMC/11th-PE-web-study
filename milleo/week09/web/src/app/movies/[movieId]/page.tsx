import type { Metadata } from 'next';
import MovieDetail from './movie-detail';

export const metadata: Metadata = { title: '영화 상세' };

export default async function MoviePage({ params }: { params: Promise<{ movieId: string }> }) {
  const { movieId } = await params;
  return <MovieDetail movieId={movieId} />;
}
