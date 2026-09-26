import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <div className="movie-card">
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
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt="북마크"
          />
        </button>
      </div>

      <h3 className="movie-title">{movie.title}</h3>
      <p className="movie-release-date">{movie.releaseDate}</p>
    </div>
  );
}