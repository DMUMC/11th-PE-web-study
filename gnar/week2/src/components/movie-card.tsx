import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={movie.title}
        />

        <button
          className="bookmark-button"
          onClick={() => onToggleBookmark(movie.id)}
        >
          {movie.isBookmarked ? "★" : "☆"}
        </button>
      </div>

      <div className="movie-info">
        <h2>{movie.title}</h2>

        <p className="original-title">
          {movie.originalTitle}
        </p>

        <p className="release-date">
          {movie.releaseDate}
        </p>

        <div className="genres">
          {movie.genres.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;