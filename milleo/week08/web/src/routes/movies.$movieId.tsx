import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { getMovie } from '../api/tmdb';
import FavoriteButton from '../components/favorite-button';
import MovieRating from '../components/movie-rating';
import QueryError from '../components/query-error';
import RequestFeedback from '../components/request-feedback';
import { queryState } from '../hooks/query-state';
import { useFavoriteStatus } from '../hooks/use-member-movies';
import { useProfile } from '../hooks/use-profile';

export const Route = createFileRoute('/movies/$movieId')({ component: MovieDetail });

function DetailFavorite({ memberId, movieId }: { memberId: number; movieId: number }) {
  const status = useFavoriteStatus(memberId, movieId);
  if (status.isPending) return <p role="status">즐겨찾기를 확인하는 중이에요.</p>;
  if (status.isError) return <QueryError error={status.error} retry={() => void status.refetch()} />;
  return <FavoriteButton memberId={memberId} movieId={movieId} checked={status.data.isFavorite} />;
}

function MovieDetail() {
  const { movieId } = Route.useParams();
  const validId = /^[1-9]\d*$/.test(movieId) && Number.isSafeInteger(Number(movieId));
  const query = useQuery({
    queryKey: ['movies', 'detail', movieId],
    queryFn: ({ signal }) => getMovie(movieId, signal),
    enabled: validId,
    staleTime: 30_000,
  });
  const profile = useProfile();
  const state = queryState(query);
  const back = <Link to="/" search={{ page: 1 }} className="inline-flex min-h-11 items-center gap-1 text-sm"><span aria-hidden="true">‹</span> 영화 목록</Link>;
  if (!validId) return <main className="p-10"><p>올바르지 않은 영화 ID입니다.</p>{back}</main>;
  if (state.status !== 'success') return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 md:px-20">
      <RequestFeedback message={state.status === 'error' ? state.message : undefined} retry={state.status === 'error' ? () => void query.refetch() : undefined} />
      {back}
    </main>
  );
  const movie = state.data;
  const memberId = profile.data?.memberId;
  return (
    <main className="flex-1">
      <section className="relative h-[360px] bg-gray-900 text-white">
        <img src={movie.backdropPath} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-start justify-between px-5 py-7 md:px-20">
          {back}
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-[42px]">{movie.title}</h1>
            <p className="mt-2 text-sm">{movie.originalTitle}</p>
            <p className="mt-2 text-sm">{[movie.releaseDate, ...movie.genres, movie.runtime].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-6 md:px-20 lg:grid-cols-[200px_1fr_360px]">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[200px] rounded-lg shadow-lg" />
        <section>
          {movie.tagline && <h2 className="mb-3 text-xl font-bold">{movie.tagline}</h2>}
          <p className="text-sm leading-7 text-gray-600">{movie.overview}</p>
          <div className="mt-4 text-sm">
            {memberId && <DetailFavorite key={`${memberId}:${movie.id}`} memberId={memberId} movieId={movie.id} />}
            {profile.isFetching && !memberId && <p role="status">회원 정보를 확인하고 있어요.</p>}
            {profile.isError && <QueryError error={profile.error} retry={() => void profile.refetch()} />}
            {!memberId && !profile.isFetching && !profile.isError && (
              <Link to="/login" className="inline-block rounded-md bg-primary px-4 py-3 font-semibold text-white">로그인하고 즐겨찾기·평점 남기기</Link>
            )}
          </div>
        </section>
        {memberId && <MovieRating key={`${memberId}:${movie.id}`} memberId={memberId} movieId={movie.id} />}
      </div>
    </main>
  );
}
