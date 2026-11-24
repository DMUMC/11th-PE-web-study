import { createFileRoute } from '@tanstack/react-router';
import { searchMovies } from '../api/movies';
import { MovieRequestError } from '../components/movies/request-message';
import { SearchPage } from '../pages/movies/search-page';
import { readPage } from '../utils/movie';

interface MovieSearch {
  query?: string;
  page?: number;
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): MovieSearch => ({
    query: typeof search.query === 'string' ? search.query.trim().slice(0, 200) || undefined : undefined,
    page: readPage(search.page),
  }),
  loaderDeps: ({ search }) => ({ query: search.query ?? '', page: search.page ?? 1 }),
  loader: ({ deps, abortController }) => deps.query ? searchMovies(deps.query, deps.page, abortController.signal) : null,
  pendingComponent: SearchPending,
  errorComponent: MovieRequestError,
  component: SearchRoute,
});

function SearchPending() {
  const { query } = Route.useSearch();
  return <SearchPage query={query} loading />;
}

function SearchRoute() {
  const { query } = Route.useSearch();
  const data = Route.useLoaderData();
  return <SearchPage query={query} data={data} />;
}
