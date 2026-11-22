"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { apiErrorMessage } from "../../api/api-response";
import { createRating, deleteRating, getMemberRatings, updateRating, type Rating, type RatingInput } from "../../api/ratings";
import { getTokenMemberId, useAuthStore } from "../../stores/auth-store";

export function MovieRating({ movieId }: { movieId: number }) {
  const { accessToken, sessionId } = useAuthStore();
  const memberId = accessToken ? getTokenMemberId(accessToken) : null;

  return (
    <section className="mt-8 rounded-xl border border-[#e3e6eb] bg-white p-5" aria-labelledby="movie-rating-title">
      <h2 id="movie-rating-title" className="mb-4 text-lg font-bold">내 평점</h2>
      {!accessToken ? <Link href="/login" className="text-sm text-[#2864dc] underline">로그인하고 평점을 남겨보세요.</Link>
        : memberId ? <MemberRating key={`${sessionId}-${movieId}`} memberId={memberId} movieId={movieId} sessionId={sessionId} />
        : <p role="alert" className="text-sm text-red-700">회원 정보를 확인할 수 없어요.</p>}
    </section>
  );
}

function MemberRating({ memberId, movieId, sessionId }: { memberId: number; movieId: number; sessionId: number }) {
  const client = useQueryClient();
  const queryKey = ["members", memberId, "ratings"] as const;
  const ratings = useQuery({ queryKey, queryFn: ({ signal }) => getMemberRatings(memberId, signal), retry: false });
  const rating = ratings.data?.find((item) => item.movieId === movieId);
  const mutation = useMutation({
    mutationFn: ({ input }: { input: RatingInput | null }) => {
      if (input === null) {
        if (!rating) throw new Error("삭제할 평점이 없어요.");
        return deleteRating(rating.ratingId);
      }
      return rating ? updateRating(rating.ratingId, input) : createRating({ movieId, ...input });
    },
    onSuccess: async (saved) => {
      await client.cancelQueries({ queryKey });
      if (sessionId !== useAuthStore.getState().sessionId) return;
      client.setQueryData<Rating[]>(queryKey, (previous) => {
        const items = previous ?? [];
        if (!saved) return items.filter((item) => item.movieId !== movieId);
        return rating ? items.map((item) => item.ratingId === saved.ratingId ? saved : item) : [saved, ...items];
      });
    },
  });

  if (ratings.isPending) return <p role="status" className="text-sm">평점을 불러오는 중이에요.</p>;
  if (ratings.isError) return (
    <p role="alert" className="text-sm">평점을 불러오지 못했어요.{" "}
      <button type="button" onClick={() => void ratings.refetch()} className="text-[#2864dc] underline">다시 시도</button>
    </p>
  );

  return (
    <>
      {rating && <p className="mb-3 text-sm">등록한 평점: {rating.score}점</p>}
      <RatingForm
        key={rating ? `${rating.ratingId}-${rating.score}-${rating.comment}` : "new"}
        rating={rating}
        pending={mutation.isPending}
        onSave={(input) => mutation.mutate({ input })}
        onDelete={() => mutation.mutate({ input: null })}
      />
      {mutation.isError && <p role="alert" className="mt-3 text-sm text-red-700">{apiErrorMessage(mutation.error, "평점을 저장하거나 삭제하지 못했어요.")}</p>}
      {mutation.isSuccess && <p role="status" className="mt-3 text-sm text-[#2864dc]">{mutation.data ? "평점을 저장했어요." : "평점을 삭제했어요."}</p>}
    </>
  );
}

function RatingForm({ rating, pending, onSave, onDelete }: {
  rating?: Rating;
  pending: boolean;
  onSave: (input: RatingInput) => void;
  onDelete: () => void;
}) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pending && score >= 1 && score <= 5) onSave({ score, comment: comment.trim() || undefined });
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={pending} className="space-y-3">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-2 text-sm font-semibold">별점</legend>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer rounded-md border border-[#e3e6eb] px-2 py-1 text-sm has-checked:border-[#2864dc] has-checked:text-[#2864dc]">
              <input type="radio" name="score" value={value} checked={score === value} onChange={() => setScore(value)} /> {value}점
            </label>
          ))}
        </fieldset>
        <label className="block text-sm font-semibold">
          후기 (선택)
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} rows={3}
            className="mt-1 block w-full rounded-lg border border-[#e3e6eb] p-3 font-normal" />
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={score === 0} className="rounded-lg bg-[#2864dc] px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-400">
            {pending ? "처리 중" : rating ? "평점 수정" : "평점 등록"}
          </button>
          {rating && <button type="button" onClick={onDelete} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700">평점 삭제</button>}
        </div>
      </fieldset>
    </form>
  );
}
