import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../api/api-client";
import { getMemberRatings } from "../../api/member-api";
import { createRating, deleteRating, updateRating, type RatingFields } from "../../api/rating-api";
import { getMemberId, useAuthStore } from "../../stores/auth-store";
import type { RatingResponse } from "../../types/member";

const primaryButton = "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50";
const secondaryButton = "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50";

type RatingChange =
  | { type: "create"; fields: RatingFields }
  | { type: "update"; ratingId: number; fields: RatingFields }
  | { type: "delete"; ratingId: number };

export function MovieRating({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);
  const memberId = accessToken ? getMemberId(accessToken) : null;

  return (
    <section className="border-t border-slate-200 pt-5" aria-labelledby="movie-rating-title">
      <h3 id="movie-rating-title" className="mb-3 text-xl font-bold">내 평점</h3>
      {memberId ? (
        <RatingEditor key={`${sessionId}-${movieId}`} memberId={memberId} movieId={movieId} />
      ) : (
        <Link to="/login" className="text-blue-700 underline">로그인하고 평점 남기기</Link>
      )}
    </section>
  );
}

function RatingEditor({ memberId, movieId }: { memberId: string; movieId: number }) {
  const queryClient = useQueryClient();
  const queryKey = ["members", memberId, "ratings"] as const;
  const [draft, setDraft] = useState<{ score: number; comment: string } | null>(null);
  const ratings = useQuery({
    queryKey,
    queryFn: ({ signal }) => getMemberRatings(memberId, signal),
    retry: false,
  });
  const rating = ratings.data?.find((item) => item.movieId === movieId);

  const changeRating = useMutation({
    mutationFn: async (change: RatingChange) => {
      switch (change.type) {
        case "create": return (await createRating({ movieId, ...change.fields })).result;
        case "update": return (await updateRating(change.ratingId, change.fields)).result;
        case "delete":
          await deleteRating(change.ratingId);
          return null;
      }
    },
    onSuccess: async (saved) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<RatingResponse[]>(queryKey, (previous) => [
        ...(previous ?? []).filter((item) => item.movieId !== movieId),
        ...(saved ? [saved] : []),
      ]);
      setDraft(null);
    },
    onError: () => queryClient.invalidateQueries({ queryKey }),
  });

  if (ratings.isPending) return <p role="status">평점을 불러오는 중…</p>;
  if (ratings.isError) {
    return (
      <>
        <p role="alert" className="mb-2 text-red-700">{getApiErrorMessage(ratings.error)}</p>
        <button type="button" className={secondaryButton} onClick={() => void ratings.refetch()}>
          평점 다시 불러오기
        </button>
      </>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || changeRating.isPending) return;

    const fields = { score: draft.score, comment: draft.comment.trim() || null };
    changeRating.mutate(rating
      ? { type: "update", ratingId: rating.ratingId, fields }
      : { type: "create", fields });
  }

  return (
    <div className="space-y-3">
      {changeRating.isError && (
        <p role="alert" className="text-red-700">{getApiErrorMessage(changeRating.error)}</p>
      )}
      {draft ? (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block font-medium">
            별점
            <select className="ml-2 rounded-lg border border-slate-300 bg-white p-2"
              value={draft.score} disabled={changeRating.isPending}
              onChange={(event) => setDraft({ ...draft, score: Number(event.target.value) })}>
              {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}점</option>)}
            </select>
          </label>
          <label className="block font-medium">
            후기
            <textarea className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2"
              rows={3} maxLength={500} value={draft.comment} disabled={changeRating.isPending}
              onChange={(event) => setDraft({ ...draft, comment: event.target.value })} />
          </label>
          <div className="flex gap-2">
            <button type="submit" className={primaryButton} disabled={changeRating.isPending}>
              {changeRating.isPending ? "저장 중…" : "평점 저장"}
            </button>
            <button type="button" className={secondaryButton} disabled={changeRating.isPending}
              onClick={() => { changeRating.reset(); setDraft(null); }}>
              취소
            </button>
          </div>
        </form>
      ) : rating ? (
        <>
          <p className="font-semibold">{rating.score}점 / 5점</p>
          {rating.comment && <p className="whitespace-pre-wrap break-words">{rating.comment}</p>}
          <div className="flex gap-2">
            <button type="button" className={secondaryButton} disabled={changeRating.isPending}
              onClick={() => {
                changeRating.reset();
                setDraft({ score: rating.score, comment: rating.comment ?? "" });
              }}>
              평점 수정
            </button>
            <button type="button" className={secondaryButton} disabled={changeRating.isPending}
              onClick={() => changeRating.mutate({ type: "delete", ratingId: rating.ratingId })}>
              {changeRating.isPending ? "삭제 중…" : "평점 삭제"}
            </button>
          </div>
        </>
      ) : (
        <button type="button" className={primaryButton}
          onClick={() => { changeRating.reset(); setDraft({ score: 5, comment: "" }); }}>
          평점 남기기
        </button>
      )}
    </div>
  );
}
