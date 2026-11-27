'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { searchMovies } from '@/api/tmdb';
import RequestFeedback from '@/components/request-feedback';
import { queryState } from '@/hooks/query-state';
import { useFavorites } from '@/hooks/use-member-movies';
import { useProfile } from '@/hooks/use-profile';

export default function SearchResults() {
  const query = useSearchParams().get('query') ?? '';
  const router = useRouter();
  const [input, setInput] = useState(query);
  const memberId = useProfile().data?.memberId;
  const favorites = useFavorites(memberId);
  const bookmarkedIds = new Set(favorites.data?.map(item => item.movieId));
  useEffect(() => { setInput(query); }, [query]);

  const keyword = query.trim();
  const queryResult = useQuery({
    queryKey: ['movies', 'search', keyword, 1],
    queryFn: ({ signal }) => searchMovies(keyword, signal),
    enabled: keyword.length > 0,
  });
  const state = queryState(queryResult);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?${new URLSearchParams({ query: input.trim() })}`);
  }

  return (
    <>
      <form className="mb-8 flex gap-2" onSubmit={submit}>
        <label className="sr-only" htmlFor="movie-query">검색어</label>
        <input
          id="movie-query"
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="영화 제목을 입력해 주세요"
          className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm"
        />
        <button type="submit" className="rounded-md bg-[#17191d] px-5 py-3 text-sm font-bold text-white">검색</button>
      </form>
      {!keyword && <p className="py-20 text-center text-gray-500">검색어를 입력해 주세요.</p>}
      {keyword && state.status === 'loading' && <RequestFeedback />}
      {keyword && state.status === 'error' && <RequestFeedback message={state.message} retry={() => void queryResult.refetch()} />}
      {keyword && state.status === 'success' && (
        <>
          <p className="mb-5 text-sm text-gray-600">“{query}” 검색 결과 {state.data.totalResults}개</p>
          {state.data.movies.length === 0 ? (
            <p className="py-20 text-center text-gray-500">검색 결과가 없어요.</p>
          ) : (
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              {state.data.movies.map(movie => (
                <Link key={movie.id} href={`/movies/${movie.id}`} className="flex gap-4 rounded-md p-2 transition-colors hover:bg-white">
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[100px] shrink-0 rounded-md object-cover" />
                  <div>
                    <h2 className="font-bold">{movie.title}</h2>
                    {bookmarkedIds.has(movie.id) && <p className="mt-1 text-xs text-primary">즐겨찾기한 영화</p>}
                    <p className="mt-1 text-xs text-gray-500">{movie.originalTitle}</p>
                    <time className="mt-2 block text-xs text-gray-500">{movie.releaseDate}</time>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{movie.overview}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
