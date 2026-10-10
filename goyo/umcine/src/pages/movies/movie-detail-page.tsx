
import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const bookmarkIds = useBookmarkStore((state) => state.bookmarkIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const bookmarked = movie ? bookmarkIds.includes(movie.id) : false;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F7F9]">
        <div className="text-center">
          <p className="text-lg font-bold text-[#17191E]">
            영화를 찾을 수 없어요.
          </p>

          <Link
            to="/"
            className="mt-4 inline-block text-sm font-bold text-[#2563EB]"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F7F9] font-[Pretendard,sans-serif]">
      <section className="relative h-[360px] w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between px-4 py-6 text-white sm:px-8 lg:px-20">
          <Link
            to="/"
            className="flex w-fit items-center gap-1 text-sm font-bold text-white no-underline"
          >
            <span className="text-lg">‹</span>
            영화 목록
          </Link>

          <div className="pb-1">
            <h1 className="mb-2 text-[28px] font-bold leading-tight sm:text-[32px] lg:text-[38px]">
              {movie.title}
            </h1>

            <p className="mb-2 text-sm font-medium text-white/90">
              {movie.originalTitle}
            </p>

            <div className="flex flex-wrap items-center gap-1 text-sm font-semibold text-white">
              <span>{movie.releaseDate}</span>
              <span>·</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>·</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 lg:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_minmax(0,1fr)_360px] lg:gap-8">
          <div>
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="w-full max-w-[200px] rounded-[10px] object-cover shadow-md"
            />
          </div>

          <div className="min-w-0">
            <h2 className="mb-3 text-xl font-bold text-[#17191E]">
              {movie.tagline}
            </h2>

            <p className="mb-2 text-sm leading-6 text-[#6B7280]">
              {movie.overview}
            </p>

            <button
              type="button"
              onClick={() => toggleBookmark(movie.id)}
              aria-label={bookmarked ? "북마크 해제" : "북마크 추가"}
              aria-pressed={bookmarked}
              className={`mt-4 flex h-[42px] cursor-pointer items-center gap-2 rounded-lg border px-4 text-sm font-bold transition-colors ${
                bookmarked
                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                  : "border-[#2563EB] bg-white text-[#2563EB]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-5 w-5 ${
                  bookmarked ? "bg-white" : "bg-[#2563EB]"
                }`}
                style={{
                  mask: "url('/movie-icons/bookmark.svg') center / contain no-repeat",
                  WebkitMask:
                    "url('/movie-icons/bookmark.svg') center / contain no-repeat",
                }}
              />

              북마크
            </button>
          </div>

          <aside className="border-t border-[#E3E6EB] pt-6 lg:border-t-0 lg:border-l lg:pt-8 lg:pl-8">
            <h2 className="text-xl font-bold text-[#17191E]">
              내 평점
            </h2>

            <p className="mt-1 text-xs text-[#969DA8]">
              별점은 클릭 후기는 선택이에요.
            </p>

            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${star}점`}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#E3E6EB] bg-white"
                >
                  <img
                    src={
                      star <= rating
                        ? "/movie-icons/star.svg"
                        : "/movie-icons/star-outline.svg"
                    }
                    alt=""
                    className="h-5 w-5"
                  />
                </button>
              ))}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="mt-3 h-[100px] w-full resize-none rounded-lg border border-[#E3E6EB] bg-white p-4 text-sm text-[#17191E] outline-none placeholder:text-[#969DA8] focus:border-[#2563EB]"
            />

            <button
              type="button"
              className="mt-2 h-[42px] w-full cursor-pointer rounded-lg border-0 bg-[#17191E] px-4 text-sm font-bold text-white"
            >
              평점 저장
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default MovieDetailPage;
