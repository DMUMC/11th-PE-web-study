import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-xl bg-slate-200 shadow-sm">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid aspect-[2/3] w-full place-items-center bg-slate-200 text-sm font-semibold text-slate-500">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2" />
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="mt-3 block truncate text-sm font-bold text-slate-900 hover:text-brand-600"
      >
        {movie.title}
      </Link>
      <p className="mt-1 text-xs text-slate-500">
        {movie.release_date || "개봉일 정보 없음"}
      </p>
    </article>
  );
}
