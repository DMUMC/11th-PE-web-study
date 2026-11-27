'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import MovieGrid from '@/components/movie-grid';
import Pagination from '@/components/pagination';
import RequestFeedback from '@/components/request-feedback';
import { getPopularMovies } from '@/api/tmdb';
import { useQuery } from '@tanstack/react-query';
import { queryState } from '@/hooks/query-state';
export default function MovieList() {
  const requestedPage = Number(useSearchParams().get('page') ?? 1);
  const page = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= 500 ? requestedPage : 1;
  const router = useRouter();
  const queryResult = useQuery({ queryKey: ['movies', 'list', page], queryFn: ({ signal }) => getPopularMovies(page, signal), enabled: true });
  const state = queryState(queryResult);
  const retry = () => { void queryResult.refetch(); };
  return <>
    {state.status === 'loading' && <RequestFeedback />}
    {state.status === 'error' && <RequestFeedback message={state.message} retry={retry} />}
    {state.status === 'success' && (state.data.movies.length === 0 ? <p className="py-20 text-center text-gray-500">표시할 영화가 없습니다.</p> : <>
      <MovieGrid movies={state.data.movies} />
      <Pagination page={page} totalPages={state.data.totalPages} onChange={next => router.push(`/?page=${next}`)} />
    </>)}
  </>;
}
