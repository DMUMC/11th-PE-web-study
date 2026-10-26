import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/model";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface MovieReview {
  rating: number;
  review: string;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const bookmarkIds = useBookmarkStore((state) => state.bookmarkIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [saved, setSaved] = useState(false);

  const bookmarked = movie
    ? bookmarkIds.includes(movie.id)
    : false;

  // TMDB 영화 상세 API 요청
  useEffect(() => {
    let cancelled = false;

    async function fetchMovieDetail() {
      setLoading(true);
      setError(null);
      setMovie(null);

      try {
       const response = await getMovieDetail(Number(movieId));

        if (cancelled) return;

        setMovie(response);
      } catch {
        if (cancelled) return;

        setError("영화 정보를 불러오지 못했어요.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMovieDetail();

    return () => {
      cancelled = true;
    };
  }, [movieId, retryCount]);

  // 영화별 저장된 평점 및 후기 불러오기
  useEffect(() => {
    setRating(0);
    setReview("");
    setSaved(false);

    try {
      const storedReview = localStorage.getItem(
        `movie-review-${movieId}`,
      );

      if (!storedReview) return;

      const parsedReview: MovieReview = JSON.parse(storedReview);

      setRating(parsedReview.rating);
      setReview(parsedReview.review);
    } catch {
      // 저장된 데이터가 손상된 경우 기본값 유지
    }
  }, [movieId]);

  // 평점 및 후기 저장
  function handleSaveReview() {
    if (rating === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    const movieReview: MovieReview = {
      rating,
      review: review.trim(),
    };

    try {
      localStorage.setItem(
        `movie-review-${movieId}`,
        JSON.stringify(movieReview),
      );

      setSaved(true);
    } catch {
      alert("평점과 후기를 저장하지 못했어요.");
    }
  }

  // 로딩 상태
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F7F9]">
        <p className="text-sm text-[#606774]">
          영화 정보를 불러오는 중이에요...
        </p>
      </main>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F6F7F9]">
        <p className="text-lg font-bold text-[#17191E]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => setRetryCount((prev) => prev + 1)}
          className="cursor-pointer rounded-lg bg-[#17191E] px-5 py-3 text-sm font-bold text-white"
        >
          다시 시도
        </button>

        <Link
          to="/"
          className="text-sm font-bold text-[#2563EB]"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  // 영화 정보가 없는 경우
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

  const backdropUrl = movie.backdrop_path
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  return (
    <main className="min-h-screen bg-[#F6F7F9] font-[Pretendard,sans-serif]">
      {/* 영화 배경 및 기본 정보 */}
      <section className="relative h-[360px] w-full overflow-hidden bg-[#17191E]">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[65%_center]"
          />
        )}

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
              {movie.original_title}
            </p>

            <div className="flex flex-wrap items-center gap-1 text-sm font-semibold text-white">
              <span>{movie.release_date || "개봉일 미정"}</span>
              <span>·</span>

              <span>
                {movie.genres.length > 0
                  ? movie.genres
                      .map((genre) => genre.name)
                      .join(" · ")
                  : "장르 정보 없음"}
              </span>

              <span>·</span>

              <span>
                {movie.runtime
                  ? `${movie.runtime}분`
                  : "상영시간 정보 없음"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 영화 상세 정보 */}
      <section className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8 lg:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_minmax(0,1fr)_360px] lg:gap-8">
          {/* 포스터 */}
          <div>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} 포스터`}
                className="w-full max-w-[200px] rounded-[10px] object-cover shadow-md"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full max-w-[200px] items-center justify-center rounded-[10px] bg-[#E3E6EB] text-sm text-[#969DA8]">
                이미지 없음
              </div>
            )}
          </div>

          {/* 줄거리 및 북마크 */}
          <div className="min-w-0">
            <h2 className="mb-3 text-xl font-bold text-[#17191E]">
              {movie.tagline || movie.title}
            </h2>

            <p className="mb-2 text-sm leading-6 text-[#6B7280]">
              {movie.overview || "등록된 줄거리가 없습니다."}
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

          {/* 평점 및 후기 */}
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
                  onClick={() => {
                    setRating(star);
                    setSaved(false);
                  }}
                  aria-label={`${star}점`}
                  aria-pressed={rating === star}
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
              onChange={(e) => {
                setReview(e.target.value);
                setSaved(false);
              }}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="mt-3 h-[100px] w-full resize-none rounded-lg border border-[#E3E6EB] bg-white p-4 text-sm text-[#17191E] outline-none placeholder:text-[#969DA8] focus:border-[#2563EB]"
            />

            <button
              type="button"
              onClick={handleSaveReview}
              className="mt-2 h-[42px] w-full cursor-pointer rounded-lg border-0 bg-[#17191E] px-4 text-sm font-bold text-white"
            >
              평점 저장
            </button>

            {saved && (
              <p
                role="status"
                className="mt-2 text-xs font-medium text-[#2563EB]"
              >
                평점과 후기가 저장되었어요.
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default MovieDetailPage;