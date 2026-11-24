import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, onBookmarkToggle }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-poster-wrap">
        <img
          className="movie-poster"
          src={movie.backdropPath}
          alt={`${movie.title} 포스터`}
        />
        <button
          className={`bookmark-button${movie.isBookmarked ? ' selected' : ''}`}
          type="button"
          aria-label={`${movie.title} ${movie.isBookmarked ? '북마크 해제' : '북마크 추가'}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? '/icons/bookmark.svg'
                : '/icons/bookmark-outline.svg'
            }
            alt=""
          />
        </button>
      </div>
      <h2>{movie.title}</h2>
      <time dateTime={movie.releaseDate.replaceAll('.', '-')}>{movie.releaseDate}</time>
    </article>
  );
}
