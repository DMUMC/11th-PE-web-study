import { apiClient } from "../api-client";
import type { Rating } from "./rating-types";

// GET /members/{memberId}/ratings — 공개 API
// back/demo는 이 API만 공통 응답으로 감싸지 않고 배열을 그대로 돌려줘요.
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}
