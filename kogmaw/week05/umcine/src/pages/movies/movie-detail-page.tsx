import { Link } from '@tanstack/react-router';
import { BookmarkButton } from '../../components/movies/bookmark-button';
import { MovieImage } from '../../components/movies/movie-image';
import type { MovieDetail } from '../../types/movie';
import { formatReleaseDate, formatRuntime, getMovieTitle } from '../../utils/movie';

export function MovieDetailPage({ movie }: { movie: MovieDetail }) {
  const title = getMovieTitle(movie);
  const metadata = [formatReleaseDate(movie.release_date), ...movie.genres.map((genre) => genre.name), formatRuntime(movie.runtime)];

  return (
    <main className="w-full flex-1">
      <section className="relative h-[240px] overflow-hidden bg-[#111820] sm:h-[350px] lg:h-[390px]" aria-label={`${title} 배경 이미지`}>
        <MovieImage className="absolute inset-0 h-full w-full object-center" path={movie.backdrop_path} backdrop alt="" eager />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/5 to-transparent" />
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link className="mb-5 inline-flex text-xs font-semibold text-[#2463cf] hover:underline" to="/" search={{}}>영화 목록</Link>
        <div className="grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8">
          <MovieImage className="aspect-[2/3] w-[150px] rounded-md shadow-sm sm:w-[180px]" path={movie.poster_path} alt={`${title} 포스터`} eager />
          <div className="min-w-0 pt-1">
            <div className="flex items-start gap-3">
              <h1 className="text-[28px] font-bold tracking-[-0.8px] text-[#17191c]">{title}</h1>
              <BookmarkButton className="mt-1 shrink-0" movieId={movie.id} movieTitle={title} />
            </div>
            {movie.original_title && <p className="mt-1 text-sm text-[#7d838c]">{movie.original_title}</p>}
            <p className="mt-4 text-xs leading-6 font-medium text-[#5d6470]">{metadata.join(' · ')}</p>
            <h2 className="mt-7 text-lg font-bold tracking-[-0.3px] text-[#202329]">{movie.tagline || '줄거리'}</h2>
            <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-7 text-[#5c626c]">{movie.overview || '등록된 줄거리가 없습니다.'}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
