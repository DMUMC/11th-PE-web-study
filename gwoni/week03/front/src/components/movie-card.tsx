import { Link } from "@tanstack/react-router";
import type { Movie } from "../types/movie";

export default function MovieCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: {
  movie: Movie;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}) {
  return (
    <div className="movie-card">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <img src={movie.posterPath} alt={movie.title} width={200} height={300} />
      </Link>

      <button type="button" onClick={() => onToggleBookmark(movie.id)}>
        <img
          src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt={isBookmarked ? "찜 해제" : "찜하기"}
          width={24}
          height={24}
        />
      </button>

      <h3>
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p>{movie.releaseDate}</p>
    </div>
  );
}
