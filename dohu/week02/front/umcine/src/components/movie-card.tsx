import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img src={posterPath} alt={`${title} 포스터`} />
        <button
          type="button"
          className={
            isBookmarked
              ? "movie-card__bookmark movie-card__bookmark--active"
              : "movie-card__bookmark"
          }
          aria-label={isBookmarked ? `${title} 북마크 해제` : `${title} 북마크`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <img
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>
      <h2 className="movie-card__title">{title}</h2>
      <p className="movie-card__date">{releaseDate}</p>
    </article>
  );
}
