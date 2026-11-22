import { createFileRoute } from '@tanstack/react-router';
import { getMovieDetail } from '../api/movies';
import { MovieDetailSkeleton, MovieRequestError } from '../components/movies/request-message';
import { MovieDetailPage } from '../pages/movies/movie-detail-page';

export const Route = createFileRoute('/movies/$movieId')({
  loader: ({ params, abortController }) => getMovieDetail(params.movieId, abortController.signal),
  pendingComponent: MovieDetailSkeleton,
  errorComponent: MovieRequestError,
  component: MovieDetailRoute,
});

function MovieDetailRoute() {
  const movie = Route.useLoaderData();
  return <MovieDetailPage movie={movie} />;
}
