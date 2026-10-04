import { createFileRoute } from '@tanstack/react-router';
import { SearchPage } from '../pages/movies/search-page';

interface MovieSearch {
  query?: string;
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): MovieSearch => ({
    query: typeof search.query === 'string' ? search.query : undefined,
  }),
  component: SearchRoute,
});

function SearchRoute() {
  const { query } = Route.useSearch();
  return <SearchPage query={query} />;
}
