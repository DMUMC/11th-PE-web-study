import { Link } from '@tanstack/react-router';
import type { Movie } from '../types/movie';
import FavoriteButton from './favorite-button';

interface MovieCardProps {
  movie: Movie;
  memberId?: number;
  favorite?: boolean;
}

export default function MovieCard({ movie, memberId, favorite }: MovieCardProps) {
  const params = { movieId: String(movie.id) };
  return (
    <article className="min-w-0">
      <div className="relative overflow-hidden rounded-[10px] bg-gray-200">
        <Link to="/movies/$movieId" params={params} aria-label={`${movie.title} 상세 보기`}>
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="aspect-[242/274] w-full object-cover" />
        </Link>
        {memberId && favorite !== undefined && (
          <div className="absolute right-2.5 top-2.5">
            <FavoriteButton memberId={memberId} movieId={movie.id} title={movie.title} checked={favorite} />
          </div>
        )}
      </div>
      <Link to="/movies/$movieId" params={params}><h2 className="mt-2 mb-0.5 truncate text-sm font-bold" title={movie.title}>{movie.title}</h2></Link>
      <time dateTime={movie.releaseDate.replaceAll('.', '-')} className="block text-xs text-gray-600">{movie.releaseDate}</time>
    </article>
  );
}
