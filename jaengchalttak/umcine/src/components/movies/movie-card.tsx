import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "./movie-image";
import { cn } from "../../utils/cn";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
  posterClassName?: string;
}

export default function MovieCard({ movie, posterClassName }: MovieCardProps) {
  const detailLink = { to: "/movies/$movieId" as const, params: { movieId: String(movie.id) } };

  return (
    <article className="min-w-0">
      <div className={cn("relative aspect-252/274 w-full overflow-hidden rounded-[9px] bg-[#e3e6eb]", posterClassName)}>
        <Link {...detailLink} className="block size-full" aria-label={`${movie.title} 상세 보기`}>
          <MovieImage className="size-full object-cover" src={getTmdbPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} />
        </Link>
        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute right-2.5 top-2.5"
        />
      </div>
      <div className="pt-2">
        <h2 className="truncate text-sm leading-5 font-semibold text-[#202124]">
          <Link {...detailLink} className="hover:underline">{movie.title}</Link>
        </h2>
        <p className="mt-px text-xs leading-4.5 text-[#9299a4]">{movie.release_date || "개봉일 정보 없음"}</p>
      </div>
    </article>
  );
}
