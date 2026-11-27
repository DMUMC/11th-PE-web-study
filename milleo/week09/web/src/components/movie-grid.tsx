import type { Movie } from '../types/movie';
import { useProfile } from '../hooks/use-profile';
import { useFavorites } from '../hooks/use-member-movies';
import MovieCard from './movie-card';
import QueryError from './query-error';

export default function MovieGrid({ movies }: { movies: Movie[] }) {
  const memberId = useProfile().data?.memberId;
  const favorites = useFavorites(memberId);
  const saved = new Set(favorites.data?.map(item => item.movieId));
  return (
    <>
      {favorites.isError && <QueryError error={favorites.error} retry={() => void favorites.refetch()} />}
      <div className="grid grid-cols-2 gap-x-[18px] gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} memberId={memberId}
            favorite={favorites.isSuccess ? saved.has(movie.id) : undefined} />
        ))}
      </div>
    </>
  );
}
