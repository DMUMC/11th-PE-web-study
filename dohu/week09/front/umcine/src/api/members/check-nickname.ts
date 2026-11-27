import { apiClient } from "../api-client";
import type { AvailabilityResponse } from "./models";

type CheckNicknameResponse = AvailabilityResponse;

function checkNickname(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameResponse>();
}

export { checkNickname, type CheckNicknameResponse };
