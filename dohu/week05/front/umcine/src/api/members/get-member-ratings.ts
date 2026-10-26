import { apiClient } from "../api-client";
import type { MemberRating } from "./models";

type GetMemberRatingsResponse = MemberRating[];

function getMemberRatings(memberId: number) {
  return apiClient
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse>();
}

export { getMemberRatings, type GetMemberRatingsResponse };
