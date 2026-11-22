import { Link } from '@tanstack/react-router';
import type { MovieSummary } from '../../types/movie';
import { cn } from '../../utils/cn';
import { formatReleaseDate, getMovieTitle } from '../../utils/movie';
import { BookmarkButton } from './bookmark-button';
import { MovieImage } from './movie-image';

interface MovieCardProps {
  movie: MovieSummary;
  variant?: 'list' | 'search';
}

export function MovieCard({ movie, variant = 'list' }: MovieCardProps) {
  const title = getMovieTitle(movie);
  const isSearch = variant === 'search';
  const Title = isSearch ? 'h3' : 'h2';

  return (
    <article className={cn('min-w-0', isSearch && 'flex h-full flex-col overflow-hidden rounded-md bg-white p-2 shadow-xs')}>
      <div className={cn('relative overflow-hidden rounded-md bg-[#dfe3e8]', isSearch ? 'aspect-[2/3]' : 'aspect-[0.9/1]')}>
        <Link className="group block h-full" to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={`${title} 상세 보기`}>
          <MovieImage className="h-full w-full object-top transition-transform duration-200 motion-safe:group-hover:scale-[1.03]" path={movie.poster_path} alt={`${title} 포스터`} />
        </Link>
        <BookmarkButton className="absolute top-2 right-2" movieId={movie.id} movieTitle={title} />
      </div>
      <Title className={cn('mt-[11px] mb-1 font-semibold leading-[1.4] tracking-[-0.35px] text-[#191b1e]', isSearch ? 'line-clamp-2 text-xs' : 'truncate text-sm')}>
        <Link className="hover:text-[#2463cf]" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{title}</Link>
      </Title>
      <time className="block text-[11px] leading-[1.4] text-[#8b9098]" dateTime={movie.release_date || undefined}>{formatReleaseDate(movie.release_date)}</time>
      {isSearch && (
        <div className="pb-1">
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#66707b]">{movie.original_title}</p>
          <p className="mt-2 line-clamp-3 text-[11px] leading-[1.6] text-[#7d838c]">{movie.overview || '등록된 줄거리가 없습니다.'}</p>
        </div>
      )}
    </article>
  );
}
