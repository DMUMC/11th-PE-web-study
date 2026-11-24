import { Link } from '@tanstack/react-router';
import type { Movie } from '../../types/movie';
import { BookmarkButton } from './bookmark-button';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
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
        <BookmarkButton
          className="absolute right-2 top-2"
          movieId={movie.id}
          movieTitle={movie.title}
        />
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
