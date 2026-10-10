import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="p-10 text-center text-lg font-medium text-gray-600">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-10 py-10">
      <img
        className="mb-8 h-[360px] w-full rounded-[12px] object-cover"
        src={movie.backdropPath}
        alt=""
        aria-hidden="true"
      />
      <Link
        className="mb-6 inline-block text-sm font-semibold text-[#5267e9] hover:underline"
        to="/"
      >
        ← 영화 목록
      </Link>
      <div className="flex flex-col md:flex-row gap-8">
        <img
          className="w-[240px] rounded-[10px] object-cover shadow-md"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />
        <div className="flex-1">
          <h1 className="mb-2 text-[32px] font-bold text-gray-900">
            {movie.title}
          </h1>
          <p className="mb-2 text-gray-500">{movie.originalTitle}</p>
          <p className="mb-2 text-sm text-gray-700">개봉일: {movie.releaseDate}</p>
          <p className="mb-2 text-sm text-gray-700">장르: {movie.genres.join(" · ")}</p>
          <p className="mb-6 text-sm text-gray-700">상영시간: {movie.runtime}</p>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            {movie.tagline}
          </h2>
          <p className="max-w-[700px] leading-7 text-gray-700">
            {movie.overview}
          </p>
        </div>
      </div>
    </main>
  );
}

export default MovieDetailPage;
