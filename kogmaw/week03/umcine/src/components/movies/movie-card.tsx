import { Link } from '@tanstack/react-router';
import type { Movie } from '../../types/movie';
import { cn } from '../../utils/cn';

interface MovieCardProps {
  movie: Movie;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, onBookmarkToggle }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[1.1/1] overflow-hidden rounded-md bg-[#dfe3e8]">
        <Link
          className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2463cf]"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
        >
          <img
            className="block h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
            src={movie.backdropPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          className={cn(
            'absolute right-2 top-2 grid size-[29px] place-items-center rounded-[5px] border border-white/80 bg-[#121418c7] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2463cf]',
            movie.isBookmarked && 'border-[#2878e8] bg-[#2878e8]',
          )}
          type="button"
          aria-label={`${movie.title} ${movie.isBookmarked ? '북마크 해제' : '북마크 추가'}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img
            className="size-[18px] invert"
            src={
              movie.isBookmarked
                ? '/icons/bookmark.svg'
                : '/icons/bookmark-outline.svg'
            }
            alt=""
          />
        </button>
      </div>
      <h2 className="mt-[11px] mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold leading-[1.3] tracking-[-0.35px] text-[#191b1e]">
        <Link
          className="hover:text-[#2463cf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2463cf]"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>
      <time
        className="block text-[11px] leading-[1.3] text-[#8b9098]"
        dateTime={movie.releaseDate.replaceAll('.', '-')}
      >
        {movie.releaseDate}
      </time>
    </article>
  );
}
