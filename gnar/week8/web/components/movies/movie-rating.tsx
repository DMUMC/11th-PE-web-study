import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRating, deleteRating, getMemberId, getRatings, updateRating } from "../../api/cinema-api";
import { getApiErrorMessage } from "../../api/member-api";
import { useMember } from "../../hooks/use-member";
import { useAuthStore } from "../../stores/auth-store";
import type { RatingResponse } from "../../types/member";

export function MovieRating({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const member = useMember();
  const memberId = token ? getMemberId(member.data, token) : undefined;

  return (
    <section className="mt-8 space-y-3" aria-labelledby="rating-title">
      <h2 id="rating-title" className="text-xl font-bold">내 평점</h2>
      {!token && <Link to="/login" className="text-blue-700 underline">로그인하고 평점 남기기</Link>}
      {token && memberId && (
        <MemberMovieRating key={`${memberId}:${movieId}`} token={token} memberId={memberId} movieId={movieId} />
      )}
      {token && !memberId && (
        <p>{member.isLoading ? "회원 정보를 불러오는 중…" : member.error
          ? getApiErrorMessage(member.error)
          : "서버 응답에서 회원 ID를 확인할 수 없어 평점을 불러올 수 없어요."}</p>
      )}
    </section>
  );
}

function MemberMovieRating({ token, memberId, movieId }: {
  token: string; memberId: string; movieId: number;
}) {
  const queryKey = ["session", token, "ratings", memberId] as const;
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => getRatings(token, memberId, signal),
  });

  if (query.isPending) return <p>평점을 불러오는 중…</p>;
  if (query.isError) return <p role="alert">{getApiErrorMessage(query.error)}</p>;
  const rating = query.data.find((item) => item.movieId === movieId);

  return <RatingForm key={rating?.ratingId ?? "new"} {...{ token, movieId, rating, queryKey }} />;
}

function RatingForm({ token, movieId, rating, queryKey }: {
  token: string;
  movieId: number;
  rating?: RatingResponse;
  queryKey: readonly unknown[];
}) {
  const [score, setScore] = useState(String(rating?.score ?? ""));
  const [comment, setComment] = useState(rating?.comment ?? "");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (action: "save" | "delete") => {
      if (action === "delete" && rating) return deleteRating(token, rating.ratingId);
      const input = { score: Number(score), comment: comment.trim() };
      return rating ? updateRating(token, rating.ratingId, input) : addRating(token, movieId, input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return (
    <form className="space-y-3" onSubmit={(event) => {
      event.preventDefault();
      if (!mutation.isPending) mutation.mutate("save");
    }}>
      <fieldset disabled={mutation.isPending} className="space-y-3">
        <label className="block">
          평점
          <input className="ml-2 rounded border p-2" type="number" min="1" max="5"
            step="1" required value={score} onChange={(event) => setScore(event.target.value)} />
        </label>
        <label className="block">
          코멘트
          <textarea className="mt-1 block w-full rounded border p-2" value={comment}
            onChange={(event) => setComment(event.target.value)} />
        </label>
        <button className="rounded bg-blue-700 px-4 py-2 text-white" type="submit">
          {rating ? "평점 수정" : "평점 등록"}
        </button>
        {rating && <button type="button" className="ml-3 text-red-700"
          onClick={() => mutation.mutate("delete")}>평점 삭제</button>}
      </fieldset>
      {mutation.isPending && <p role="status">처리 중…</p>}
      {mutation.isError && <p role="alert">{getApiErrorMessage(mutation.error)}</p>}
    </form>
  );
}
