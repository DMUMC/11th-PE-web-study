import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
}

export default function MovieGrid({
  movies,
  bookmarkedIds,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section
      className="
        grid w-full
        grid-cols-1
        gap-x-4 gap-y-6
        bg-[#F6F7F9]
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
      "
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.includes(movie.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}