import type { ApiResponse } from "../api-client";
import { authApi } from "../auth-api";

// 🔒 DELETE /ratings/{ratingId}
export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
