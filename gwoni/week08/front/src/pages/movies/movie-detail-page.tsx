import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { movieApi } from "../../api";
import type { Rating } from "../../api/ratings/rating-types";
import { useFavoriteStatusQuery, useToggleFavoriteMutation } from "../../hooks/use-favorite";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMemberRatingsQuery,
  useMyMemberId,
  useUpdateRatingMutation,
} from "../../hooks/use-rating";
import { queryKeys } from "../../hooks/query-keys";
import { useAuthStore } from "../../stores/auth-store";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);

  const movieQuery = useQuery({
    queryKey: queryKeys.movieDetail(movieId),
    queryFn: () => movieApi.getMovieDetail(movieId),
  });

  if (movieQuery.isPending) return <main>영화를 불러오는 중이에요.</main>;
  if (movieQuery.isError) return <main>{movieQuery.error.message}</main>;

  const movie = movieQuery.data;
  if (movie === null) return <main>영화를 찾을 수 없어요.</main>;

  return (
    <main>
      <img src={movie.backdropPath} alt="" aria-hidden="true" />
      <Link to="/">영화 목록</Link>
      <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
      <h1>{movie.title}</h1>
      <FavoriteButton movieId={movie.id} />
      <p>{movie.originalTitle}</p>
      <p>{movie.releaseDate}</p>
      <p>{movie.genres.join(" · ")}</p>
      <p>{movie.runtime ?? "상영 시간 정보가 없어요."}</p>
      <h2>{movie.tagline}</h2>
      <p>{movie.overview}</p>
      <MyRatingSection movieId={movie.id} />
    </main>
  );
}

// GET /favorites/{movieId} + POST /favorites, DELETE /favorites/{movieId}
function FavoriteButton({ movieId }: { movieId: number }) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const statusQuery = useFavoriteStatusQuery(movieId);
  const toggleMutation = useToggleFavoriteMutation(movieId);

  const isFavorite = statusQuery.data?.isFavorite ?? false;
  const disabled = statusQuery.isLoading || toggleMutation.isPending;

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      navigate({ to: "/login" });
      return;
    }
    if (disabled) return;
    toggleMutation.mutate(isFavorite);
  };

  return (
    <button type="button" onClick={handleClick} disabled={disabled}>
      <img
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt={isFavorite ? "찜 해제" : "찜하기"}
        width={24}
        height={24}
      />
    </button>
  );
}

// GET /members/{memberId}/ratings 에서 이 영화의 내 평점을 찾아 등록/수정/삭제
function MyRatingSection({ movieId }: { movieId: number }) {
  const memberId = useMyMemberId();
  const ratingsQuery = useMemberRatingsQuery(memberId);

  if (memberId === null) {
    return (
      <section className="mt-6">
        <h2 className="font-bold">내 평점</h2>
        <p className="text-sm">
          <Link to="/login" className="underline">로그인</Link>하면 평점을 남길 수 있어요.
        </p>
      </section>
    );
  }

  if (ratingsQuery.isPending) return <p className="mt-6 text-sm">평점을 불러오는 중이에요.</p>;
  if (ratingsQuery.isError) return <p className="mt-6 text-sm text-red-600">평점을 불러오지 못했어요.</p>;

  const myRating = ratingsQuery.data.find((rating) => rating.movieId === movieId) ?? null;

  // key: 평점이 생기거나 바뀌면 폼 초기값을 다시 잡아요.
  return (
    <RatingForm
      key={myRating ? `${myRating.ratingId}-${myRating.updatedAt}` : "new"}
      movieId={movieId}
      myRating={myRating}
    />
  );
}

function RatingForm({ movieId, myRating }: { movieId: number; myRating: Rating | null }) {
  const [score, setScore] = useState(myRating?.score ?? 5);
  const [comment, setComment] = useState(myRating?.comment ?? "");

  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();
  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const trimmedComment = comment.trim() || undefined;
    if (myRating) {
      updateMutation.mutate({ ratingId: myRating.ratingId, body: { score, comment: trimmedComment } });
    } else {
      createMutation.mutate({ movieId, score, comment: trimmedComment });
    }
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    deleteMutation.mutate(myRating.ratingId);
  };

  return (
    <section className="mt-6">
      <h2 className="font-bold">내 평점</h2>
      <form className="space-y-2" onSubmit={handleSubmit}>
        <label className="block text-sm" htmlFor="rating-score">별점</label>
        <select
          id="rating-score"
          className="border px-2 py-1"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {"★".repeat(value)} ({value})
            </option>
          ))}
        </select>

        <label className="block text-sm" htmlFor="rating-comment">한줄평</label>
        <input
          id="rating-comment"
          className="w-full border px-2 py-1"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-2">
          <button type="submit" className="border px-2 py-1 disabled:opacity-50" disabled={isPending}>
            {myRating ? "평점 수정" : "평점 등록"}
          </button>
          {myRating && (
            <button type="button" className="border px-2 py-1 disabled:opacity-50" disabled={isPending} onClick={handleDelete}>
              평점 삭제
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
