'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import MovieGrid from '../components/movie-grid';
import Pagination from '../components/pagination';
import RequestFeedback from '../components/request-feedback';
import { getPopularMovies, sampleMode } from '../api/tmdb';
import { useQuery } from '@tanstack/react-query';
import { queryState } from '../hooks/query-state';
import { useFavorites } from '../hooks/use-favorites';
export default function MovieList() {
  const rawPage = Number(useSearchParams().get('page') ?? 1);
  const page = Number.isInteger(rawPage) && rawPage >= 1 && rawPage <= 500 ? rawPage : 1;
  const router = useRouter();
  const queryResult = useQuery({ queryKey: ['movies', 'list', page], queryFn: ({ signal }) => getPopularMovies(page, signal), enabled: true });
  const state = queryState(queryResult);
  const retry = () => { void queryResult.refetch(); };
  const { bookmarkedIds } = useFavorites();
  const { toggleBookmark, mutation } = useFavorites();
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pt-6 pb-10 md:px-20">
    <h1 className="mb-5 text-[34px] font-bold">영화 목록</h1>{mutation.error && <p role="alert">{mutation.error.message}</p>}
    {sampleMode && <p className="mb-5 text-sm text-gray-500">로컬 실습용 샘플 영화입니다. TMDB 토큰을 설정하면 실제 영화 목록으로 연결됩니다.</p>}
    {state.status === 'loading' && <RequestFeedback />}
    {state.status === 'error' && <RequestFeedback message={state.message} retry={retry} />}
    {state.status === 'success' && (state.data.movies.length === 0 ? <p className="py-20 text-center text-gray-500">표시할 영화가 없습니다.</p> : <>
      <MovieGrid movies={state.data.movies.map(movie => ({ ...movie, isBookmarked: bookmarkedIds.includes(movie.id) }))} onToggleBookmark={toggleBookmark} />
      <Pagination page={page} totalPages={state.data.totalPages} onChange={next => router.push(`/?page=${next}`)} />
    </>)}
  </main>;
}
