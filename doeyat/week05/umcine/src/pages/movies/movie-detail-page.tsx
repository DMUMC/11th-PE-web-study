import { Link, useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useMovieRequest } from "../../hooks/use-movie-request";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "../../components/movies/movie-image";
import { RequestMessage } from "../../components/movies/request-message";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  if (!Number.isSafeInteger(parsedMovieId) || parsedMovieId <= 0) {
    return <main><RequestMessage error showConfigHint={false}>올바르지 않은 영화 번호예요.</RequestMessage></main>;
  }
  return <MovieDetailContent key={parsedMovieId} movieId={parsedMovieId} />;
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const request = useCallback((signal: AbortSignal) => getMovieDetail(movieId, signal), [movieId]);
  const state = useMovieRequest(request);
  if (state.status === "loading") {
    return <main><RequestMessage>영화 정보를 불러오는 중이에요.</RequestMessage></main>;
  }
  if (state.status === "error") {
    return <main><RequestMessage error>{getMovieDetailErrorMessage(state.error)}</RequestMessage></main>;
  }
  const movie = state.data;
  const runtime = movie.runtime === null ? "상영 시간 정보가 없어요." : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f7f8fa] pb-12">
      <MovieImage className="h-60 w-full object-cover sm:h-105" src={getTmdbBackdropUrl(movie.backdrop_path)} alt="" />
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-10 lg:px-20">
        <Link className="mb-6 inline-block text-[#2864dc] hover:underline" to="/">영화 목록</Link>
        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
          <MovieImage className="aspect-2/3 w-full max-w-50 rounded-lg object-cover" src={getTmdbPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-[#1d1e20]">{movie.title}</h1>
              <BookmarkButton movieId={movie.id} className="px-3 py-1.5 text-sm" />
            </div>
            <p className="mt-1 text-[#676d76]">{movie.original_title}</p>
            <p className="mt-4 text-sm text-[#676d76]">{movie.release_date || "개봉일 정보 없음"} · {movie.genres.map((genre) => genre.name).join(", ") || "장르 정보 없음"} · {runtime}</p>
            {movie.tagline && <h2 className="mt-8 text-xl font-semibold">{movie.tagline}</h2>}
            <p className="mt-3 leading-7 text-[#676d76]">{movie.overview || "줄거리 정보가 없어요."}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
