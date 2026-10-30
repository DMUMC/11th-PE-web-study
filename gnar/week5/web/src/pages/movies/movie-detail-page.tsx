import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null): string {
  if (runtime === null) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours}시간 ${minutes}분`;
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const parsedMovieId = Number(movieId);

  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    async function loadMovie() {
      try {
        const response = await getMovieDetail(parsedMovieId);

        if (!ignore) {
          setMovie(response);
        }
      } catch (error: unknown) {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  // 잘못된 ID는 API 요청 전에 화면에서도 구분합니다.
  if (!isValidMovieId) {
    return (
      <p className="status error" role="alert">
        올바르지 않은 영화 번호예요.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="status" role="status">
        영화 정보를 불러오는 중이에요.
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="status error" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (!movie) {
    return <p className="status">표시할 영화 정보가 없어요.</p>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const genres =
    movie.genres.map((genre) => genre.name).join(", ") ||
    "장르 정보 없음";

  return (
    <article>
      <Link className="back-link" to="/movies">
        ← 영화 목록
      </Link>

      {backdropUrl ? (
        <img
          className="movie-backdrop"
          src={backdropUrl}
          alt={`${movie.title} 배경`}
        />
      ) : (
        <div className="movie-backdrop image-placeholder">
          이미지 없음
        </div>
      )}

      <div className="detail-layout">
        {posterUrl ? (
          <img
            className="detail-poster"
            src={posterUrl}
            alt={`${movie.title} 포스터`}
          />
        ) : (
          <div className="detail-poster image-placeholder">
            이미지 없음
          </div>
        )}

        <div className="detail-information">
          <h1>{movie.title}</h1>
          <p className="original-title">{movie.original_title}</p>

          <p>개봉일: {movie.release_date || "정보 없음"}</p>
          <p>장르: {genres}</p>
          <p>상영 시간: {formatRuntime(movie.runtime)}</p>
          <p>
            평점: {movie.vote_average.toFixed(1)}
            {" / "}
            평가 {movie.vote_count.toLocaleString()}개
          </p>

          {movie.tagline && (
            <blockquote>{movie.tagline}</blockquote>
          )}

          <h2>줄거리</h2>
          <p className="overview">
            {movie.overview.trim() || "등록된 줄거리가 없어요."}
          </p>
        </div>
      </div>
    </article>
  );
}