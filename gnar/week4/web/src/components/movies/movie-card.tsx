//src/components/movies/movie-card.tsx
import { Link } from "@tanstack/react-router";

import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block overflow-hidden"
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-full object-cover transition-transform hover:scale-105"
          />
        </Link>

        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          variant="icon"
          className="absolute right-3 top-3"
        />
      </div>

      <div className="space-y-2 p-4">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block hover:text-blue-600"
        >
          <h2 className="text-base font-bold">{movie.title}</h2>
        </Link>

        <p className="text-sm text-slate-500">
          {movie.originalTitle}
        </p>

        <p className="text-sm text-slate-500">
          {movie.releaseDate}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
