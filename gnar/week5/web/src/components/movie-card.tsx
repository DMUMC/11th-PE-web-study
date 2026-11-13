import { Link } from "react-router-dom";
import type { TmdbMovieListItem } from "../api/movies/models";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="movie-card"
    >
      {posterUrl ? (
        <img
          className="movie-poster"
          src={posterUrl}
          alt={`${movie.title} 포스터`}
          loading="lazy"
        />
      ) : (
        <div className="movie-poster image-placeholder">
          이미지 없음
        </div>
      )}

      <div className="movie-card-body">
        <h2>{movie.title}</h2>
        <p>개봉일: {movie.release_date || "정보 없음"}</p>
        <p>평점: {movie.vote_average.toFixed(1)}</p>
      </div>
    </Link>
  );
}