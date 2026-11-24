import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const detailLink = { to: "/movies/$movieId" as const, params: { movieId: String(movie.id) } };

  return (
    <article className="min-w-0">
      <div className="relative aspect-252/274 w-full overflow-hidden rounded-[9px] bg-[#e3e6eb]">
        <Link {...detailLink} className="block size-full" aria-label={`${movie.title} 상세 보기`}>
          <img className="size-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
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
        <p className="mt-px text-xs leading-4.5 text-[#9299a4]">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
