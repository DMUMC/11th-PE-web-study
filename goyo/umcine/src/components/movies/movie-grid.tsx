import type { TmdbMovieListItem } from "../../api/movies/model";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
  bookmarkedIds: number[];
  onToggleBookmark: (movieId: number) => void;
  bookmarkPending?: boolean;
}

export default function MovieGrid({
  movies,
  bookmarkedIds,
  onToggleBookmark,
  bookmarkPending = false,
}: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.includes(movie.id)}
          onToggleBookmark={onToggleBookmark}
          bookmarkPending={bookmarkPending}
        />
      ))}
    </div>
  );
}