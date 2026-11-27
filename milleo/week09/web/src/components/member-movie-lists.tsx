import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getMovie } from '../api/tmdb';
import { useFavorites, useRatings } from '../hooks/use-member-movies';
import { useProfile } from '../hooks/use-profile';
import QueryError from './query-error';

function MovieLink({ movieId }: { movieId: number }) {
  const id = String(movieId);
  const movie = useQuery({
    queryKey: ['movies', 'detail', id],
    queryFn: ({ signal }) => getMovie(id, signal),
    staleTime: 30_000,
    retry: false,
  });
  return <Link href={`/movies/${id}`} className="font-semibold text-primary underline-offset-4 hover:underline">{movie.data?.title ?? `영화 #${movieId}`}</Link>;
}

export default function MemberMovieLists() {
  const profile = useProfile();
  return profile.data && <MemberLists key={profile.data.memberId} memberId={profile.data.memberId} />;
}

function MemberLists({ memberId }: { memberId: number }) {
  const favorites = useFavorites(memberId);
  const ratings = useRatings(memberId);

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      <section aria-label="내 즐겨찾기" className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold">내 즐겨찾기</h2>
        {favorites.isPending && <p role="status" className="mt-3 text-sm">즐겨찾기를 불러오는 중이에요.</p>}
        {favorites.isError && <QueryError error={favorites.error} retry={() => void favorites.refetch()} />}
        {favorites.data?.length === 0 && <p className="mt-3 text-sm text-gray-600">즐겨찾기한 영화가 없어요.</p>}
        {favorites.data && <ul className="divide-y divide-gray-100">{favorites.data.map(favorite => (
          <li key={favorite.favoriteId} className="py-3"><MovieLink movieId={favorite.movieId} /></li>
        ))}</ul>}
      </section>
      <section aria-label="내 평점" className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold">내 평점</h2>
        {ratings.isPending && <p role="status" className="mt-3 text-sm">평점을 불러오는 중이에요.</p>}
        {ratings.isError && <QueryError error={ratings.error} retry={() => void ratings.refetch()} />}
        {ratings.data?.length === 0 && <p className="mt-3 text-sm text-gray-600">등록한 평점이 없어요.</p>}
        {ratings.data && <ul className="divide-y divide-gray-100">{ratings.data.map(rating => (
          <li key={rating.ratingId} className="py-3">
            <MovieLink movieId={rating.movieId} />
            <span className="ml-2 text-sm font-semibold">{rating.score} / 5점</span>
            {rating.comment && <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-600">{rating.comment}</p>}
          </li>
        ))}</ul>}
      </section>
    </div>
  );
}
