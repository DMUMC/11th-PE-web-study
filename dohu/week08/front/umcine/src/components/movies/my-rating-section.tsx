import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { MemberRating } from "../../api/members/models";
import { useMeQuery } from "../../hooks/use-me-query";
import {
  useDeleteRatingMutation,
  useMyRatingsQuery,
  useSaveRatingMutation,
} from "../../hooks/use-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

const RATING_SCORES = [1, 2, 3, 4, 5];

interface RatingFormProps {
  movieId: number;
  memberId: number;
  savedRating: MemberRating | null;
}

// 저장된 평점이 바뀌면 key로 다시 만들어져 입력값이 그 평점으로 시작한다.
function RatingForm({ movieId, memberId, savedRating }: RatingFormProps) {
  const [rating, setRating] = useState(savedRating?.score ?? 0);
  const [comment, setComment] = useState(savedRating?.comment ?? "");
  const saveMutation = useSaveRatingMutation(memberId);
  const deleteMutation = useDeleteRatingMutation(memberId);
  const isBusy = saveMutation.isPending || deleteMutation.isPending;

  function handleSave() {
    if (rating === 0 || isBusy) return;
    saveMutation.mutate({ savedRating, movieId, score: rating, comment: comment.trim() });
  }

  function handleDelete() {
    if (!savedRating || isBusy) return;
    deleteMutation.mutate(savedRating.ratingId);
  }

  return (
    <>
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
            <Icon name={score <= rating ? "star" : "star-outline"} />
          </button>
        ))}
      </div>
      <textarea
        className="mt-3 h-[100px] w-full resize-none rounded-lg border border-line bg-white p-3 text-sm outline-none placeholder:text-ink-muted"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <button
        type="button"
        disabled={rating === 0 || isBusy}
        onClick={handleSave}
        className="mt-2 h-10 w-full rounded-md bg-ink text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {saveMutation.isPending ? "저장 중" : savedRating ? "평점 수정" : "평점 저장"}
      </button>
      {savedRating && (
        <button
          type="button"
          disabled={isBusy}
          onClick={handleDelete}
          className="mt-2 h-10 w-full rounded-md border border-line bg-white text-sm font-bold text-ink-sub disabled:cursor-not-allowed"
        >
          {deleteMutation.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      )}
    </>
  );
}

interface MyRatingSectionProps {
  movieId: number;
}

export function MyRatingSection({ movieId }: MyRatingSectionProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  const memberId = meQuery.data?.memberId;
  // 회원의 평점 목록은 영화마다 같으므로 회원 번호로만 캐시한다.
  const ratingsQuery = useMyRatingsQuery(memberId);

  // 받은 목록에서 지금 보고 있는 영화의 평점만 찾는다.
  const savedRating =
    ratingsQuery.data?.find((rating) => rating.movieId === movieId) ?? null;
  const isError = meQuery.isError || ratingsQuery.isError;

  function renderNotice() {
    if (meQuery.isLoading || ratingsQuery.isLoading) return "내 평점을 불러오는 중이에요.";
    if (isError) return "내 평점을 불러오지 못했어요.";
    if (savedRating) {
      return `${savedRating.createdAt.slice(0, 10).replaceAll("-", ".")}에 남긴 평점이에요.`;
    }
    return "별점은 필수, 후기는 선택이에요.";
  }

  return (
    <section className="w-full shrink-0 border-line lg:w-[360px] lg:border-l lg:pl-8">
      <h2 className="text-xl font-bold">내 평점</h2>
      {!accessToken ? (
        <p className="mt-1.5 text-xs text-ink-muted">
          <Link to="/login" className="font-bold text-primary">
            로그인
          </Link>
          하면 평점을 남길 수 있어요.
        </p>
      ) : (
        <>
          <p
            className={cn("mt-1.5 text-xs", isError ? "text-danger" : "text-ink-muted")}
            role={isError ? "alert" : undefined}
          >
            {renderNotice()}
          </p>
          {memberId !== undefined && ratingsQuery.isSuccess && (
            <RatingForm
              key={savedRating ? `${savedRating.ratingId}-${savedRating.updatedAt}` : "new"}
              movieId={movieId}
              memberId={memberId}
              savedRating={savedRating}
            />
          )}
        </>
      )}
    </section>
  );
}
