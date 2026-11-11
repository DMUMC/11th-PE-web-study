import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBookmarkStore } from "../stores/bookmark-store";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../api/movies/models";
import { getMovieDetailErrorMessage } from "../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../utils/movies/tmdb-image";

export const Route = createFileRoute("/movies/$movieId")({
  component: RouteComponent,
});

interface MovieDetailState {
  id: number;
  movie: TmdbMovieDetail | null;
  loading: boolean;
  error: string;
}

function RouteComponent() {
  const { movieId } = Route.useParams();

  const id = Number(movieId);
  const isValidId = Number.isSafeInteger(id) && id > 0;

  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState<MovieDetailState>({
    id: 0,
    movie: null,
    loading: true,
    error: "",
  });

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(id),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  useEffect(() => {
    if (!isValidId) return;

    let ignore = false;

    async function loadMovie() {
      setResult({
        id,
        movie: null,
        loading: true,
        error: "",
      });

      try {
        const movie = await getMovieDetail(id);

        if (!ignore) {
          setResult({
            id,
            movie,
            loading: false,
            error: "",
          });
        }
      } catch (error) {
        if (!ignore) {
          setResult({
            id,
            movie: null,
            loading: false,
            error: getMovieDetailErrorMessage(error),
          });
        }
      }
    }

    void loadMovie();

    return () => {
      ignore = true;
    };
  }, [id, isValidId, retryCount]);

  if (!isValidId) {
    return (
      <div className="my-[24px]">
        <p>올바른 영화 ID가 아니에요.</p>
        <Link to="/" className="text-[#2563EB]">
          영화 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (result.loading || result.id !== id) {
    return (
      <p role="status" className="my-[24px]">
        영화 정보를 불러오는 중이에요.
      </p>
    );
  }

  if (result.error) {
    return (
      <div role="alert" className="my-[24px]">
        <p>{result.error}</p>

        <div className="flex items-center gap-[16px] mt-[12px]">
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="px-[16px] py-[10px] rounded-[8px]
              bg-[#17191E] text-white cursor-pointer"
          >
            다시 시도
          </button>

          <Link to="/" className="text-[#2563EB]">
            영화 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const movie = result.movie;

  if (!movie) {
    return (
      <div className="my-[24px]">
        <p>영화를 찾을 수 없어요.</p>
        <Link to="/" className="text-[#2563EB]">
          영화 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const score = [1, 2, 3, 4, 5];
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <>
      {/* 영화 상단 */}
      <div className="relative text-white bg-[#17191E]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="w-full h-[360px] object-cover"
          />
        ) : (
          <div className="w-full h-[360px]" />
        )}

        {/* 배경 위 글자의 가독성을 위한 그라데이션 */}
        <div
          aria-hidden="true"
          className="absolute inset-0
            bg-gradient-to-t from-black/90 via-black/40 to-black/20"
        />

        <Link
          to="/"
          className="absolute top-[24px] left-[80px]
            flex items-center gap-[4px]"
        >
          <img
            src="/icon/movie-icons/chevron-left.svg"
            alt=""
            className="w-[24px] h-[24px]"
          />

          <span className="font-bold text-[13px]">
            영화 목록
          </span>
        </Link>

        {/* 영화 정보 */}
        <div className="absolute bottom-[32px] left-[80px] right-[32px]">
          <h1 className="font-bold text-[46px] leading-tight">
            {movie.title}
          </h1>

          <p className="font-normal text-[14px] mt-[8px]">
            {movie.original_title}
          </p>

          <div
            className="flex flex-wrap items-center gap-[8px]
              font-bold text-[13px] mt-[8px]"
          >
            <p>{movie.release_date || "개봉일 정보 없음"}</p>

            {movie.genres.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <p>
                  {movie.genres.map((genre) => genre.name).join(" · ")}
                </p>
              </>
            )}

            <span aria-hidden="true">·</span>

            <p>
              {movie.runtime !== null
                ? `${movie.runtime}분`
                : "상영 시간 정보 없음"}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="flex py-[24px] gap-[30px]">
        {/* 왼쪽: 포스터 */}
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="w-[200px] h-[286px]
              rounded-[16px] object-cover shrink-0"
          />
        ) : (
          <div
            className="w-[200px] h-[286px] rounded-[16px]
              bg-gray-200 flex items-center justify-center
              text-[14px] text-[#606774] shrink-0"
          >
            포스터가 없어요.
          </div>
        )}

        {/* 가운데: 영화 정보 */}
        <div className="flex-1 min-w-0 flex flex-col gap-[12px]">
          {movie.tagline && (
            <h2 className="font-bold text-[21px] text-[#17191E]">
              {movie.tagline}
            </h2>
          )}

          <p
            className="font-normal text-[14px]
              text-[#606774] whitespace-pre-line"
          >
            {movie.overview || "줄거리 정보가 없어요."}
          </p>

          {/* 즐겨찾기 버튼 */}
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={`min-w-[108px] w-fit h-[42px]
              px-[12px] rounded-[8px] cursor-pointer
              flex items-center justify-center gap-[8px]
              font-extrabold text-[14px] text-white ${isBookmarked ? "bg-[#2563EB]" : "bg-[#17191E]"
              }`}
          >
            <img
              src={
                isBookmarked
                  ? "/icon/movie-icons/bookmarkYes.svg"
                  : "/icon/movie-icons/bookmarkNo.svg"
              }
              alt=""
              className="w-[16px] h-[16px]"
            />

            <span>
              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </span>
          </button>
        </div>

        {/* 오른쪽: 평점 UI */}
        <div
          className="flex flex-col gap-[8px] w-[360px]
            shrink-0 pl-[30px] border-l border-[#E3E6EB]"
        >
          <h2 className="font-bold text-[21px] text-[#17191E]">
            내 평점
          </h2>

          <p className="font-normal text-[12px] text-[#969DA8]">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="flex gap-[4px]" aria-label="별점">
            {score.map((num) => (
              <img
                key={num}
                src="/icon/movie-icons/oneScore.svg"
                alt={`${num}번째 별`}
                className="w-[38px] h-[38px]"
              />
            ))}
          </div>

          <div
            className="w-full h-[102px] px-[12px] py-[18px]
              rounded-[16px] bg-white border border-[#E3E6EB]"
          >
            <textarea
              key={movie.id}
              aria-label="영화 후기"
              className="w-full h-full resize-none
                placeholder:text-[13px] placeholder:font-normal"
              placeholder="영화를 보고 느낀 점을 남겨보세요."
            />
          </div>

          <button
            type="button"
            disabled
            className="w-full h-[42px] bg-[#17191E]
              rounded-[8px] text-white px-[16px]
              flex items-center justify-center
              text-[14px] font-extrabold
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            평점 저장
          </button>
        </div>
      </div>
    </>
  );
}