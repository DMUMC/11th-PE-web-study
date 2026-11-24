import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button"; 

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col">
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#ddd]">
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="w-full h-full object-cover block"
        />

        <div className="absolute right-2 top-2">
          <BookmarkButton movieId={movie.id} />
        </div>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-2.5 mb-0.5 text-sm font-semibold text-[#111] whitespace-nowrap overflow-hidden text-ellipsis text-left">
          {movie.title}
        </h3>
      </Link>

      <p className="m-0 text-xs text-[#888] text-left">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;