import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieCard } from "./movie-card";

const gridClass =
  "mt-5 grid grid-cols-2 gap-x-[18px] gap-y-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className={gridClass}>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}

export function MovieGridSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        영화 목록을 불러오는 중이에요.
      </p>
      <ul className={gridClass} aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <li key={index} className="animate-pulse">
            <div className="aspect-[242/274] rounded-lg bg-gray-200" />
            <div className="mt-[7px] h-5 w-3/4 rounded bg-gray-200" />
            <div className="mt-0.5 h-4 w-1/3 rounded bg-gray-200" />
          </li>
        ))}
      </ul>
    </div>
  );
}
