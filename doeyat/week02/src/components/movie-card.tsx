import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-poster-wrapper">
        <img className="movie-poster" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`bookmark-button${movie.isBookmarked ? " active" : ""}`}
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={`/icons/movie-icons/${movie.isBookmarked ? "bookmark" : "bookmark-outline"}.svg`}
            alt=""
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </button>
      </div>
      <div className="movie-info">
        <h2 className="movie-name">{movie.title}</h2>
        <p className="movie-date">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
