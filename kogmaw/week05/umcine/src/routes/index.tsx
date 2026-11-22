import { createFileRoute } from '@tanstack/react-router';
import { getPopularMovies } from '../api/movies';
import { MovieRequestError } from '../components/movies/request-message';
import { MovieListPage } from '../pages/movies/movie-list-page';
import { readPage } from '../utils/movie';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { page?: number } => ({ page: readPage(search.page) }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: ({ deps, abortController }) => getPopularMovies(deps.page, abortController.signal),
  pendingComponent: () => <MovieListPage />,
  errorComponent: MovieRequestError,
  component: MovieListRoute,
});

function MovieListRoute() {
  const data = Route.useLoaderData();
  return <MovieListPage data={data} />;
}
