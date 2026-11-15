import { authApi } from "../auth-api";
import { unwrap, type ApiResponse } from "../api-response";

export interface MemberInfo { email: string; nickname: string; createdAt: string }

export async function getMe(signal?: AbortSignal) {
  return unwrap(await authApi.get("members/me", { signal }).json<ApiResponse<MemberInfo>>());
}
