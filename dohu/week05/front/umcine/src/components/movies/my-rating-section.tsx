import { useEffect, useState } from "react";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRating } from "../../api/members/models";
import { CURRENT_MEMBER_ID } from "../../config/current-member";
import { cn } from "../../utils/cn";
import { Icon } from "../common/icon";

const RATING_SCORES = [1, 2, 3, 4, 5];

interface RatingFormProps {
  savedRating: MemberRating | null;
}

// 저장된 평점이 바뀌면 key로 다시 만들어져 입력값이 그 평점으로 시작한다.
function RatingForm({ savedRating }: RatingFormProps) {
  const [rating, setRating] = useState(savedRating?.score ?? 0);
  const [comment, setComment] = useState(savedRating?.comment ?? "");

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
        className="mt-2 h-10 w-full rounded-md bg-ink text-sm font-bold text-white"
      >
        평점 저장
      </button>
    </>
  );
}

interface MyRatingSectionProps {
  movieId: number;
}

export function MyRatingSection({ movieId }: MyRatingSectionProps) {
  const [savedRating, setSavedRating] = useState<MemberRating | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );

  useEffect(() => {
    let ignore = false;

    // 회원의 평점 목록을 받아 지금 보고 있는 영화의 평점만 찾는다.
    getMemberRatings(CURRENT_MEMBER_ID)
      .then((ratings) => {
        if (ignore) return;
        setSavedRating(
          ratings.find((rating) => rating.movieId === movieId) ?? null,
        );
        setStatus("success");
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [movieId]);

  function renderNotice() {
    if (status === "loading") return "내 평점을 불러오는 중이에요.";
    if (status === "error") return "내 평점을 불러오지 못했어요.";
    if (savedRating) {
      return `${savedRating.createdAt.slice(0, 10).replaceAll("-", ".")}에 남긴 평점이에요.`;
    }
    return "별점은 필수, 후기는 선택이에요.";
  }

  return (
    <section className="w-full shrink-0 border-line lg:w-[360px] lg:border-l lg:pl-8">
      <h2 className="text-xl font-bold">내 평점</h2>
      <p
        className={cn(
          "mt-1.5 text-xs",
          status === "error" ? "text-danger" : "text-ink-muted",
        )}
        role={status === "error" ? "alert" : undefined}
      >
        {renderNotice()}
      </p>
      <RatingForm key={savedRating?.ratingId ?? "new"} savedRating={savedRating} />
    </section>
  );
}
