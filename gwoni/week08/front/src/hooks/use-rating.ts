import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import { createRating, type CreateRatingRequest } from "../api/ratings/create-rating";
import { updateRating, type UpdateRatingRequest } from "../api/ratings/update-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { getApiErrorMessage } from "../api/api-client";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/jwt";
import { queryKeys } from "./query-keys";

// 로그인한 회원의 memberId (토큰 subject)
export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}

// GET /members/{memberId}/ratings
export function useMemberRatingsQuery(memberId: number | null) {
  return useQuery({
    queryKey: queryKeys.memberRatings(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== null,
  });
}

// POST / PATCH / DELETE 평점: 성공하면 해당 회원의 평점 목록을 다시 조회해요.
// (POST 응답에는 ratingId만 있어서 캐시를 직접 만들 수 없어요.)
function useInvalidateMyRatings() {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();
  return () => {
    if (memberId !== null) {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberRatings(memberId) });
    }
  };
}

export function useCreateRatingMutation() {
  const invalidate = useInvalidateMyRatings();
  return useMutation({
    mutationFn: (body: CreateRatingRequest) => createRating(body),
    onSuccess: (response) => {
      alert(response.message);
      invalidate();
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점 등록에 실패했어요. 다시 시도해 주세요."));
    },
  });
}

export function useUpdateRatingMutation() {
  const invalidate = useInvalidateMyRatings();
  return useMutation({
    mutationFn: ({ ratingId, body }: { ratingId: number; body: UpdateRatingRequest }) =>
      updateRating(ratingId, body),
    onSuccess: (response) => {
      alert(response.message);
      invalidate();
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점 수정에 실패했어요. 다시 시도해 주세요."));
    },
  });
}

export function useDeleteRatingMutation() {
  const invalidate = useInvalidateMyRatings();
  return useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: (response) => {
      alert(response.message);
      invalidate();
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "평점 삭제에 실패했어요. 다시 시도해 주세요."));
    },
  });
}
