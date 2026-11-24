import { Link } from '@tanstack/react-router';
import { movies } from '../../data/movies';

interface MovieDetailPageProps {
  movieId: string;
}

export function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const movie = movies.find((item) => String(item.id) === movieId);

  if (!movie) {
    return (
      <main className="grid min-h-[calc(100vh-73px)] place-items-center bg-[#f5f7f9] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#17191c]">영화를 찾을 수 없어요.</h1>
          <Link
            className="mt-6 inline-flex rounded-md bg-[#2463cf] px-5 py-2.5 text-sm font-bold text-white"
            to="/"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f5f7f9]">
      <section className="relative h-[300px] overflow-hidden bg-[#111820] sm:h-[350px] lg:h-[390px]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/20" />
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          className="mb-5 inline-flex text-xs font-semibold text-[#2463cf] hover:underline"
          to="/"
        >
          영화 목록
        </Link>

        <div className="grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8">
          <img
            className="w-[150px] rounded-md object-cover shadow-sm sm:w-[180px]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="min-w-0 pt-1">
            <h1 className="text-[28px] font-bold tracking-[-0.8px] text-[#17191c]">
              {movie.title}
            </h1>
            <p className="mt-1 text-sm text-[#7d838c]">{movie.originalTitle}</p>
            <p className="mt-4 text-xs font-medium text-[#5d6470]">
              {movie.releaseDate} · {movie.genres.join(' · ')} · {movie.runtime}
            </p>

            <h2 className="mt-7 text-lg font-bold tracking-[-0.3px] text-[#202329]">
              {movie.tagline}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5c626c]">
              {movie.overview}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
