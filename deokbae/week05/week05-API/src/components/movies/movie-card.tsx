import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "../bookmark-button";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col">
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#ddd]">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[#888]">
            이미지 없음
          </div>
        )}

        <div className="absolute right-2 top-2">
          <BookmarkButton movieId={movie.id} />
        </div>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-2.5 mb-0.5 text-sm font-semibold text-[#111] whitespace-nowrap overflow-hidden text-ellipsis text-left">
          {movie.title}
        </h3>
      </Link>

      <p className="m-0 text-xs text-[#888] text-left">
        {movie.release_date || "개봉일 정보 없음"}
      </p>
    </article>
  );
}

export default MovieCard;