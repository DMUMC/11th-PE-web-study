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
      <img src={movie.posterPath} alt={movie.title} width={200} height={300} />

      <button type="button" onClick={() => onToggleBookmark(movie.id)}>
        <img
          src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt={isBookmarked ? "찜 해제" : "찜하기"}
          width={24}
          height={24}
        />
      </button>

      <h3>{movie.title}</h3>
      <p>{movie.releaseDate}</p>
    </div>
  );
}
