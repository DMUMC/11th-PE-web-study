import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorite, removeFavorite } from "../../api/favorites";
import { getMemberRatings, createRating, updateRating, deleteRating } from "../../api/ratings";
import { getCurrentMemberId } from "../../api/auth/member-id";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useAuthStore } from "../../stores/auth-store";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));
  const memberId = getCurrentMemberId();
  const queryClient = useQueryClient();
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });
  const favoriteQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavorite(movieId),
    enabled: isValidMovieId && isLoggedIn,
  });
  const favoriteMutation = useMutation({
    mutationFn: () =>
      favoriteQuery.data ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["favorites", movieId] }),
        queryClient.invalidateQueries({ queryKey: ["favorites"] }),
      ]);
    },
  });

  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p role="alert" className="text-xl font-semibold text-slate-700">
          올바르지 않은 영화 번호예요.
        </p>
        <Link to="/" className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center" aria-live="polite">
        <p className="text-xl font-semibold text-slate-700">영화 정보를 불러오는 중이에요...</p>
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p role="alert" className="text-xl font-semibold text-slate-700">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </p>
        <Link to="/" className="mt-5 inline-flex text-sm font-semibold text-blue-700 hover:underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const movieData = movieDetailQuery.data;
  const movie = {
    id: movieData.id,
    title: movieData.title,
    originalTitle: movieData.original_title,
    releaseDate: movieData.release_date || "개봉일 정보 없음",
    posterPath: getTmdbPosterUrl(movieData.poster_path) ?? "",
    backdropPath: getTmdbBackdropUrl(movieData.backdrop_path) ?? "",
    genres: movieData.genres.map((genre) => genre.name),
    runtime: movieData.runtime ? `${movieData.runtime}분` : "정보 없음",
    tagline: movieData.tagline,
    overview: movieData.overview || "줄거리 정보가 없어요.",
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900 shadow-xl">
        {movie.backdropPath ? (
          <img
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
            className="h-[360px] w-full object-cover brightness-50 sm:h-[420px]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            {movie.posterPath ? (
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="h-48 w-32 rounded-2xl border border-white/20 object-cover shadow-lg sm:h-60 sm:w-40"
              />
            ) : (
              <div className="flex h-48 w-32 items-center justify-center rounded-2xl bg-slate-800 text-center text-xs text-slate-300 sm:h-60 sm:w-40">
                포스터 없음
              </div>
            )}

            <div className="max-w-3xl text-white">
              <Link to="/" className="mb-3 inline-flex text-sm text-slate-200 hover:text-white">
                ← 영화 목록
              </Link>
              <h1 className="text-2xl font-bold sm:text-4xl">{movie.title}</h1>
              <p className="mt-2 text-sm text-slate-200 sm:text-base">{movie.originalTitle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-200 sm:text-sm">
                <span>{movie.releaseDate}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span>{movie.genres.join(" · ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">줄거리</h2>
          <p className="mt-4 text-base leading-7 text-slate-700">{movie.overview}</p>
          <p className="mt-6 text-lg font-semibold text-slate-900">{movie.tagline}</p>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">영화 정보</h3>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between gap-4">
              <dt>원제</dt>
              <dd className="text-right text-slate-800">{movie.originalTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>개봉일</dt>
              <dd className="text-right text-slate-800">{movie.releaseDate}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>장르</dt>
              <dd className="text-right text-slate-800">{movie.genres.join(", ")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>상영 시간</dt>
              <dd className="text-right text-slate-800">{movie.runtime}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">즐겨찾기</h2>
          {isLoggedIn ? (
            <>
              {favoriteQuery.isError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {favoriteQuery.error.message}
                </p>
              )}
              {favoriteMutation.isError && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {favoriteMutation.error.message}
                </p>
              )}
              <button
                type="button"
                disabled={favoriteQuery.isPending || favoriteMutation.isPending}
                onClick={() =>
                  favoriteQuery.isError
                    ? void favoriteQuery.refetch()
                    : favoriteMutation.mutate()
                }
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {favoriteQuery.isPending
                  ? "확인 중..."
                  : favoriteQuery.isError
                    ? "다시 시도"
                  : favoriteQuery.data
                    ? "즐겨찾기 해제"
                    : "즐겨찾기 추가"}
              </button>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              <Link to="/login" className="font-semibold text-blue-700 hover:underline">
                로그인
              </Link>
              하면 즐겨찾기를 저장할 수 있어요.
            </p>
          )}
        </div>

        <RatingSection
          movieId={movieId}
          memberId={memberId}
          isLoggedIn={isLoggedIn}
        />
      </section>
    </main>
  );
}

interface RatingSectionProps {
  movieId: number;
  memberId: number | null;
  isLoggedIn: boolean;
}

function RatingSection({ movieId, memberId, isLoggedIn }: RatingSectionProps) {
  const ratingsQuery = useQuery({
    queryKey: ["ratings", memberId],
    queryFn: () => {
      if (memberId === null) {
        throw new Error("회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.");
      }
      return getMemberRatings(memberId);
    },
    enabled: isLoggedIn && memberId !== null,
  });
  const rating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">내 평점</h2>
      {isLoggedIn ? (
        memberId === null ? (
          <p role="alert" className="mt-3 text-sm text-red-600">
            회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.
          </p>
        ) : ratingsQuery.isPending ? (
          <p aria-live="polite" className="mt-3 text-sm text-slate-500">평점을 불러오는 중이에요...</p>
        ) : ratingsQuery.isError ? (
          <p role="alert" className="mt-3 text-sm text-red-600">{ratingsQuery.error.message}</p>
        ) : (
          <RatingEditor
            key={`${movieId}-${rating?.ratingId ?? "new"}`}
            movieId={movieId}
            memberId={memberId}
            rating={rating}
          />
        )
      ) : (
        <p className="mt-3 text-sm text-slate-600">
          <Link to="/login" className="font-semibold text-blue-700 hover:underline">
            로그인
          </Link>
          하면 평점을 남길 수 있어요.
        </p>
      )}
    </div>
  );
}

interface RatingEditorProps {
  movieId: number;
  memberId: number | null;
  rating: Awaited<ReturnType<typeof getMemberRatings>>[number] | undefined;
}

function RatingEditor({ movieId, memberId, rating }: RatingEditorProps) {
  const queryClient = useQueryClient();
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const saveMutation = useMutation({
    mutationFn: () => {
      if (rating) {
        return updateRating(rating.ratingId, { score, comment });
      }
      return createRating({ movieId, score, comment });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ratings", memberId] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!rating) {
        throw new Error("삭제할 평점이 없어요.");
      }
      return deleteRating(rating.ratingId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ratings", memberId] });
    },
  });

  return (
    <>
      <div className="mt-4 flex gap-2" aria-label="평점 선택">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={score === value}
            onClick={() => setScore(value)}
            className={`text-2xl ${score >= value ? "text-amber-400" : "text-slate-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="rating-comment">
        한줄평
      </label>
      <textarea
        id="rating-comment"
        maxLength={500}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="mt-2 min-h-24 w-full rounded-lg border border-slate-300 p-3 text-sm"
        placeholder="영화에 대한 감상을 남겨 주세요."
      />
      {(saveMutation.isError || deleteMutation.isError) && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {saveMutation.error?.message ?? deleteMutation.error?.message}
        </p>
      )}
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={!score || saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveMutation.isPending ? "저장 중..." : rating ? "평점 수정" : "평점 등록"}
        </button>
        {rating && (
          <button
            type="button"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            평점 삭제
          </button>
        )}
      </div>
    </>
  );
}