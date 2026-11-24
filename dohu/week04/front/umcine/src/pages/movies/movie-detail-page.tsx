import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "../../components/common/icon";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

const RATING_SCORES = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [rating, setRating] = useState(0);

  if (!movie) {
    return (
      <main className="flex-1 px-5 py-20 text-center text-ink-sub">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="flex-1">
      <section className="relative h-[360px] overflow-hidden bg-gray-900 text-white">
        <img
          className="absolute inset-0 size-full object-cover object-[center_22%]"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-5 pb-6 pt-7 lg:px-20">
          <Link
            to="/"
            className="flex items-center gap-1 self-start text-[13px] font-bold"
          >
            <Icon name="chevron-left" className="size-5" />
            영화 목록
          </Link>
          <div className="mt-auto">
            <h1 className="text-3xl font-extrabold tracking-[-0.88px] lg:text-[44px] lg:leading-[56px]">
              {movie.title}
            </h1>
            <p className="mt-2 text-[15px] text-white/85">
              {movie.originalTitle}
            </p>
            <p className="mt-2 flex flex-wrap gap-x-3 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pb-16 pt-6 lg:flex-row lg:px-20">
        <img
          className="h-[286px] w-[200px] shrink-0 rounded-lg object-cover shadow-lg"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <section className="min-w-0 flex-1 pt-1">
          <h2 className="text-xl font-bold">{movie.tagline}</h2>
          <p className="mt-3 text-sm leading-6 text-ink-sub">{movie.overview}</p>
          <BookmarkButton
            movieId={movie.id}
            title={movie.title}
            variant="label"
            className="mt-4"
          />
        </section>

        <section className="w-full shrink-0 border-line lg:w-[360px] lg:border-l lg:pl-8">
          <h2 className="text-xl font-bold">내 평점</h2>
          <p className="mt-1.5 text-xs text-ink-muted">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="mt-3 flex gap-1.5">
            {RATING_SCORES.map((score) => (
              <button
                key={score}
                type="button"
                className={cn(
                  "flex size-9 items-center justify-center rounded-md border border-line bg-white",
                  score <= rating ? "text-amber-400" : "text-ink-sub",
                )}
                aria-label={`${score}점`}
                aria-pressed={score <= rating}
                onClick={() => setRating(score)}
              >
                <Icon name="star" />
              </button>
            ))}
          </div>
          <textarea
            className="mt-3 h-[100px] w-full resize-none rounded-lg border border-line bg-white p-3 text-sm outline-none placeholder:text-ink-muted"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />
          <button
            type="button"
            className="mt-2 h-10 w-full rounded-md bg-ink text-sm font-bold text-white"
          >
            평점 저장
          </button>
        </section>
      </div>
    </main>
  );
}
