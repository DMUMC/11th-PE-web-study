import { backendClient } from "../backend-client";
import type { AvailabilityResponse, RatingResponse } from "./models";

function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}

function getMemberRatings(memberId: number) {
  return backendClient
    .get(`members/${memberId}/ratings`)
    .json<RatingResponse[]>();
}

export { checkEmail, checkNickname, getMemberRatings };
