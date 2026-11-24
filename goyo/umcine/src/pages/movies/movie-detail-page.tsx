import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMyInfo } from "../../api/members/get-my-info";

import {
  getFavoriteStatus,
  createFavorite,
  deleteFavorite,
} from "../../api/favorites";

import {
  getMemberRatings,
  createRating,
  updateRating,
  deleteRating,
} from "../../api/ratings";

import { useAuthStore } from "../../stores/auth-store";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);

  return (
    <MovieDetailContent
      key={movieId}
      movieId={movieId}
    />
  );
}

function MovieDetailContent({
  movieId,
}: {
  movieId: number;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const isLoggedIn = Boolean(accessToken);
  const isValidMovieId =
    Number.isInteger(movieId) && movieId > 0;

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 영화 상세 정보 조회
  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  // 로그인한 회원 정보 조회
  const memberQuery = useQuery({
    queryKey: ["members", "me", accessToken],
    queryFn: getMyInfo,
    enabled: isLoggedIn,
    retry: false,
  });

  const memberId = memberQuery.data?.result?.memberId;

  // 해당 영화 즐겨찾기 상태 조회
  const favoriteQuery = useQuery({
    queryKey: [
      "favorites",
      "status",
      accessToken,
      movieId,
    ],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: isLoggedIn && isValidMovieId,
    retry: false,
  });

  const isFavorite =
    isLoggedIn &&
    (favoriteQuery.data?.result?.isFavorite ?? false);

  // 즐겨찾기 추가 및 삭제
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["favorites"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorite-movies"],
        }),
      ]);
    },

    onError: () => {
      alert("즐겨찾기 처리에 실패했습니다.");
    },
  });

  // 서버에 저장된 내 평점 및 댓글 조회
  const ratingsQuery = useQuery({
    queryKey: [
      "ratings",
      "member",
      memberId,
      accessToken,
    ],
    queryFn: () => getMemberRatings(memberId!),
    enabled: isLoggedIn && Boolean(memberId),
    retry: false,
  });

  // 현재 영화에 작성한 내 평점 및 댓글
  const myRating = isLoggedIn
    ? (ratingsQuery.data ?? []).find(
        (rating) => Number(rating.movieId) === movieId,
      )
    : undefined;

  const isRatingLoading =
    isLoggedIn &&
    (memberQuery.isPending || ratingsQuery.isPending) &&
    !memberQuery.isError &&
    !ratingsQuery.isError &&
    (memberQuery.isPending || Boolean(memberId));

  const isRatingError =
    isLoggedIn &&
    (
      memberQuery.isError ||
      ratingsQuery.isError ||
      (memberQuery.isSuccess && !memberId)
    );

  // 평점 및 댓글 등록 / 수정
  const saveRatingMutation = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) {
        throw new Error("로그인이 필요합니다.");
      }

      if (score < 1 || score > 5) {
        throw new Error("별점을 선택해주세요.");
      }

      const body = {
        score,
        comment: comment.trim(),
      };

      const response = myRating
        ? await updateRating(myRating.ratingId, body)
        : await createRating({
            movieId,
            ...body,
          });

      if (!response.isSuccess) {
        throw new Error(response.message);
      }

      return response;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ratings", "member"],
      });

      setIsEditing(false);
      setScore(0);
      setComment("");
      setErrorMessage("");
    },

    onError: (error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "평점 및 댓글 저장에 실패했습니다.",
      );
    },
  });

  // 평점 및 댓글 삭제
  const deleteRatingMutation = useMutation({
    mutationFn: async () => {
      if (!myRating) {
        throw new Error("삭제할 댓글이 없습니다.");
      }

      const response = await deleteRating(
        myRating.ratingId,
      );

      if (!response.isSuccess) {
        throw new Error(response.message);
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ratings", "member"],
      });

      setIsEditing(false);
      setScore(0);
      setComment("");
      setErrorMessage("");
    },

    onError: (error) => {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "댓글 삭제에 실패했습니다.",
      );
    },
  });

  const isRatingPending =
    saveRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  function handleToggleFavorite() {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      void navigate({ to: "/login" });
      return;
    }

    if (
      favoriteQuery.isPending ||
      favoriteMutation.isPending
    ) {
      return;
    }

    if (favoriteQuery.isError) {
      alert("즐겨찾기 정보를 불러오지 못했습니다.");
      return;
    }

    favoriteMutation.mutate();
  }

  function handleSaveRating() {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      void navigate({ to: "/login" });
      return;
    }

    if (
      isRatingLoading ||
      isRatingError ||
      isRatingPending
    ) {
      return;
    }

    if (score < 1 || score > 5) {
      setErrorMessage("별점을 선택해주세요.");
      return;
    }

    setErrorMessage("");
    saveRatingMutation.mutate();
  }

  function handleEditRating() {
    if (!myRating) return;

    setScore(myRating.score);
    setComment(myRating.comment ?? "");
    setErrorMessage("");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setScore(0);
    setComment("");
    setErrorMessage("");
  }

  function handleDeleteRating() {
    if (!myRating || isRatingPending) return;

    const confirmed = window.confirm(
      "작성한 평점과 댓글을 삭제하시겠습니까?",
    );

    if (!confirmed) return;

    setErrorMessage("");
    deleteRatingMutation.mutate();
  }

  // 잘못된 영화 ID
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[400px] items-center justify-center">
        <p>잘못된 영화 정보입니다.</p>
      </main>
    );
  }

  // 로딩
  if (movieQuery.isPending) {
    return (
      <main className="flex min-h-[400px] items-center justify-center bg-[#F6F7F9]">

        <p className="text-sm text-[#606774]">
          영화 정보를 불러오는 중이에요...
        </p>
      </main>
    );
  }

  // 조회 실패
  if (movieQuery.isError || !movieQuery.data) {
    return (
      <main className="flex min-h-[400px] flex-col items-center justify-center gap-4 bg-[#F6F7F9]">
        <p className="text-sm text-[#606774]">

          영화 정보를 불러오지 못했어요.
        </p>

        <button
          type="button"

          onClick={() => void movieQuery.refetch()}
          className="rounded-lg bg-[#17191E] px-5 py-3 text-sm font-bold text-white"

        >
          다시 시도
        </button>

        <Link
          to="/"

          className="text-sm text-[#2563EB]"

        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const movie = movieQuery.data;

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : null;

  const bookmarkIcon = isFavorite
    ? "/movie-icons/bookmark.svg"
    : "/movie-icons/bookmark-outline.svg";

  return (
    <main className="min-h-screen bg-[#F6F7F9] px-4 py-8 font-[Pretendard,sans-serif] sm:px-8 lg:px-20">
      <div className="mx-auto w-full max-w-[1200px]">

        {/* 영화 목록 이동 */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#606774] no-underline hover:text-[#17191E]"
        >
          ← 영화 목록
        </Link>

        {/* 영화 상세 정보 */}
        <section className="flex flex-col gap-8 rounded-2xl border border-[#E3E6EB] bg-white p-6 md:flex-row md:p-8">

          {/* 영화 포스터 */}
          <div className="mx-auto w-full max-w-[280px] shrink-0 md:mx-0">

            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} 포스터`}

                className="aspect-[2/3] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-[#E3E6EB] text-sm text-[#969DA8]">

                이미지 없음
              </div>
            )}
          </div>

          {/* 영화 정보 */}
          <div className="min-w-0 flex-1">

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[32px] font-bold leading-tight text-[#17191E]">
                  {movie.title}
                </h1>

                <p className="mt-2 text-sm text-[#969DA8]">
                  {movie.original_title}
                </p>
              </div>

              {/* 즐겨찾기 버튼 */}
              <button
                type="button"
                aria-label={
                  isFavorite
                    ? "북마크 해제"
                    : "북마크 추가"
                }
                aria-pressed={isFavorite}
                disabled={
                  favoriteMutation.isPending ||
                  (
                    isLoggedIn &&
                    favoriteQuery.isPending
                  )
                }
                onClick={handleToggleFavorite}
                className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border disabled:cursor-wait disabled:opacity-50 ${
                  isFavorite
                    ? "border-[#2563EB] bg-[#2563EB]"
                    : "border-[#17191E] bg-[#17191E]"
                }`}
              >
                <img
                  src={bookmarkIcon}
                  alt=""
                  className="h-6 w-6"
                />
              </button>
            </div>

            {/* 개봉일 및 상영시간 */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#606774]">
              <span>
                {movie.release_date || "개봉일 미정"}
              </span>

              {movie.runtime !== null && (
                <>
                  <span>·</span>
                  <span>{movie.runtime}분</span>
                </>
              )}

              <span>·</span>

              <span className="font-semibold text-[#D97706]">
                ★ {movie.vote_average.toFixed(1)}
              </span>
            </div>

            {/* 장르 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-[#F1F3F5] px-3 py-1.5 text-xs font-medium text-[#606774]"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* 영화 소개 문구 */}
            {movie.tagline && (
              <p className="mt-6 text-base font-semibold italic text-[#2563EB]">
                {movie.tagline}
              </p>
            )}

            {/* 줄거리 */}
            <div className="mt-7">
              <h2 className="mb-3 text-xl font-bold text-[#17191E]">
                줄거리
              </h2>

              <p className="whitespace-pre-line text-sm leading-7 text-[#606774]">
                {movie.overview ||
                  "등록된 줄거리가 없습니다."}
              </p>
            </div>
          </div>
        </section>

        {/* 평점 및 댓글 영역 */}
        <section className="mt-8 rounded-2xl border border-[#E3E6EB] bg-white p-6 md:p-8">

          <h2 className="mb-6 text-2xl font-bold text-[#17191E]">
            나의 평점 및 리뷰
          </h2>

          {!isLoggedIn ? (
            /* 비로그인 상태 */
            <div className="flex flex-col items-center gap-4 rounded-xl bg-[#F6F7F9] px-5 py-10">
              <p className="text-sm text-[#606774]">
                로그인 후 평점과 리뷰를 작성할 수 있어요.
              </p>

              <Link
                to="/login"
                className="rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white no-underline"
              >
                로그인
              </Link>
            </div>
          ) : isRatingLoading ? (
            /* 내 평점 조회 중 */
            <p className="py-8 text-center text-sm text-[#606774]">
              작성한 리뷰를 불러오는 중이에요...
            </p>
          ) : isRatingError ? (
            /* 내 평점 조회 실패 */
            <div className="flex flex-col items-center gap-4 py-8">
              <p className="text-sm text-red-500">
                작성한 리뷰를 불러오지 못했습니다.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (
                    memberQuery.isError ||
                    !memberId
                  ) {
                    void memberQuery.refetch();
                  } else {
                    void ratingsQuery.refetch();
                  }
                }}
                className="rounded-lg bg-[#17191E] px-4 py-2 text-sm font-semibold text-white"
              >
                다시 시도
              </button>
            </div>
          ) : myRating && !isEditing ? (
            /* 이미 작성한 내 댓글 */
            <div className="rounded-xl border border-[#E3E6EB] p-5">

              <div className="flex flex-wrap items-center justify-between gap-4">

                <div>
                  <p className="font-bold text-[#17191E]">
                    {memberQuery.data?.result?.nickname ||
                      "나의 리뷰"}
                  </p>

                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl ${
                          star <= myRating.score
                            ? "text-[#F5B301]"
                            : "text-[#D1D5DB]"
                        }`}
                      >
                        ★
                      </span>
                    ))}

                    <span className="ml-2 text-sm font-semibold text-[#606774]">
                      {myRating.score}/5
                    </span>
                  </div>
                </div>

                {/* 수정 및 삭제 버튼 */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleEditRating}
                    disabled={isRatingPending}
                    className="cursor-pointer rounded-md border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#606774] hover:bg-[#F6F7F9] disabled:opacity-50"
                  >
                    수정
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteRating}
                    disabled={isRatingPending}
                    className="cursor-pointer rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleteRatingMutation.isPending
                      ? "삭제 중..."
                      : "삭제"}
                  </button>
                </div>
              </div>

              {/* 작성한 댓글 내용 */}
              <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-6 text-[#17191E]">
                {myRating.comment ||
                  "작성된 리뷰 내용이 없습니다."}
              </p>

              {(myRating.updatedAt ||
                myRating.createdAt) && (
                <p className="mt-4 text-xs text-[#969DA8]">
                  {new Date(
                    myRating.updatedAt ||
                      myRating.createdAt!,
                  ).toLocaleDateString("ko-KR")}
                </p>
              )}
            </div>
          ) : (
            /* 평점 및 댓글 작성 / 수정 폼 */
            <div className="rounded-xl border border-[#E3E6EB] p-5">

              <h3 className="mb-4 text-base font-bold text-[#17191E]">
                {isEditing
                  ? "리뷰 수정"
                  : "리뷰 작성"}
              </h3>

              {/* 별점 선택 */}
              <div className="mb-5">
                <p className="mb-2 text-sm font-semibold text-[#606774]">
                  별점
                </p>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star}점`}
                      aria-pressed={score === star}
                      disabled={isRatingPending}
                      onClick={() => {
                        setScore(star);
                        setErrorMessage("");
                      }}
                      className={`cursor-pointer text-[36px] leading-none transition-colors ${
                        star <= score
                          ? "text-[#F5B301]"
                          : "text-[#D1D5DB]"
                      }`}
                    >
                      ★
                    </button>
                  ))}

                  <span className="ml-3 text-sm font-semibold text-[#606774]">
                    {score}/5
                  </span>
                </div>
              </div>

              {/* 댓글 입력 */}
              <div>
                <label
                  htmlFor="movie-review"
                  className="mb-2 block text-sm font-semibold text-[#606774]"
                >
                  리뷰
                </label>

                <textarea
                  id="movie-review"
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  disabled={isRatingPending}
                  placeholder="영화에 대한 감상을 작성해주세요."
                  rows={5}
                  className="w-full resize-y rounded-lg border border-[#E3E6EB] bg-white p-4 text-sm leading-6 text-[#17191E] outline-none placeholder:text-[#969DA8] focus:border-[#2563EB]"
                />
              </div>

              {/* 등록 / 수정 버튼 */}
              <div className="mt-4 flex justify-end gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isRatingPending}
                    className="cursor-pointer rounded-lg border border-[#D1D5DB] px-5 py-3 text-sm font-semibold text-[#606774]"
                  >
                    취소
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveRating}
                  disabled={
                    score === 0 || isRatingPending
                  }
                  className="cursor-pointer rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saveRatingMutation.isPending
                    ? "저장 중..."
                    : isEditing
                      ? "수정 완료"
                      : "리뷰 등록"}
                </button>
              </div>
            </div>
          )}

          {/* API 오류 메시지 */}
          {errorMessage && (
            <p className="mt-4 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
