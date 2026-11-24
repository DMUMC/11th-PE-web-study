import { createFileRoute } from '@tanstack/react-router';
import MovieGrid from '../components/movie-grid';
import Pagination from '../components/pagination';
import RequestFeedback from '../components/request-feedback';
import { getPopularMovies } from '../api/tmdb';
import { useQuery } from '@tanstack/react-query';
import { queryState } from '../hooks/query-state';
import { useBookmarkStore } from '../stores/bookmark-store';
export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): { page: number } => {
    const page = Number(search.page ?? 1);
    return { page: Number.isInteger(page) && page >= 1 && page <= 500 ? page : 1 };
  }, component: MovieList,
});
function MovieList() {
  const { page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryResult = useQuery({ queryKey: ['movies', 'list', page], queryFn: ({ signal }) => getPopularMovies(page, signal), enabled: true });
  const state = queryState(queryResult);
  const retry = () => { void queryResult.refetch(); };
  const bookmarkedIds = useBookmarkStore(s => s.bookmarkedIds);
  const toggleBookmark = useBookmarkStore(s => s.toggleBookmark);
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-6 pb-10 md:px-20">
    <h1 className="mb-5 text-[34px] font-bold">영화 목록</h1>
    {state.status === 'loading' && <RequestFeedback />}
    {state.status === 'error' && <RequestFeedback message={state.message} retry={retry} />}
    {state.status === 'success' && (state.data.movies.length === 0 ? <p className="py-20 text-center text-gray-500">표시할 영화가 없습니다.</p> : <>
      <MovieGrid movies={state.data.movies.map(movie => ({ ...movie, isBookmarked: bookmarkedIds.includes(movie.id) }))} onToggleBookmark={toggleBookmark} />
      <Pagination page={page} totalPages={state.data.totalPages} onChange={next => void navigate({ search: { page: next } })} />
    </>)}
  </main>;
}
