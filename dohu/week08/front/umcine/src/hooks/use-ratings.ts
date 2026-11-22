import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMemberRatings } from "../api/members/get-member-ratings";
import type { MemberRating } from "../api/members/models";
import { createRating, deleteRating, updateRating } from "../api/ratings/ratings";

function getRatingsQueryKey(memberId: number | undefined) {
  return ["members", memberId, "ratings"] as const;
}

// 유저별 평점 조회는 공개 API라 내 회원 번호를 알아야 내 평점을 찾을 수 있다.
export function useMyRatingsQuery(memberId: number | undefined) {
  return useQuery({
    queryKey: getRatingsQueryKey(memberId),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined,
  });
}

interface SaveRatingVariables {
  savedRating: MemberRating | null;
  movieId: number;
  score: number;
  comment: string;
}

export function useSaveRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    // 저장된 평점이 있으면 수정, 없으면 등록한다.
    mutationFn: ({ savedRating, movieId, score, comment }: SaveRatingVariables) =>
      savedRating
        ? updateRating({ ratingId: savedRating.ratingId, score, comment })
        : createRating({ movieId, score, comment }),
    onSuccess: (response) => {
      alert(response.message);
      queryClient.invalidateQueries({ queryKey: getRatingsQueryKey(memberId) });
    },
    onError: () => {
      alert("평점을 저장하지 못했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation(memberId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (response) => {
      alert(response.message);
      queryClient.invalidateQueries({ queryKey: getRatingsQueryKey(memberId) });
    },
    onError: () => {
      alert("평점을 삭제하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
