import { createFileRoute } from '@tanstack/react-router';
import MovieGrid from '../components/movie-grid';
import Pagination from '../components/pagination';
import RequestFeedback from '../components/request-feedback';
import { getPopularMovies, sampleMode } from '../api/tmdb';
import { useQuery } from '@tanstack/react-query';
import { queryState } from '../hooks/query-state';
import { useFavorites } from '../hooks/use-favorites';
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
  const { bookmarkedIds: bookmarkedIds } = useFavorites();
  const { toggleBookmark: toggleBookmark } = useFavorites();
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-6 pb-10 md:px-20">
    <h1 className="mb-5 text-[34px] font-bold">영화 목록</h1>
    {sampleMode && <p className="mb-5 text-sm text-gray-500">로컬 실습용 샘플 영화입니다. TMDB 토큰을 설정하면 실제 영화 목록으로 연결됩니다.</p>}
    {state.status === 'loading' && <RequestFeedback />}
    {state.status === 'error' && <RequestFeedback message={state.message} retry={retry} />}
    {state.status === 'success' && (state.data.movies.length === 0 ? <p className="py-20 text-center text-gray-500">표시할 영화가 없습니다.</p> : <>
      <MovieGrid movies={state.data.movies.map(movie => ({ ...movie, isBookmarked: bookmarkedIds.includes(movie.id) }))} onToggleBookmark={toggleBookmark} />
      <Pagination page={page} totalPages={state.data.totalPages} onChange={next => void navigate({ search: { page: next } })} />
    </>)}
  </main>;
}
