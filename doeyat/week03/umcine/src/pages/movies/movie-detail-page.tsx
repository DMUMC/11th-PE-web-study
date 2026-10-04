import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return <main className="px-5 py-10 sm:px-10 lg:px-20">영화를 찾을 수 없어요.</main>;
  }

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f7f8fa] pb-12">
      <img className="max-h-105 w-full object-cover" src={movie.backdropPath} alt="" />
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-10 lg:px-20">
        <Link className="mb-6 inline-block text-[#2864dc] hover:underline" to="/">영화 목록</Link>
        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
          <img className="w-full max-w-50 rounded-lg object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
          <div>
            <h1 className="text-3xl font-bold text-[#1d1e20]">{movie.title}</h1>
            <p className="mt-1 text-[#676d76]">{movie.originalTitle}</p>
            <p className="mt-4 text-sm text-[#676d76]">{movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}</p>
            <h2 className="mt-8 text-xl font-semibold">{movie.tagline}</h2>
            <p className="mt-3 leading-7 text-[#676d76]">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
