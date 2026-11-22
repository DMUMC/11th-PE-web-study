import { apiClient, authApi, type ApiResponse } from "./api-client";
import type { CheckResponse, RatingResponse } from "../types/member";

export { getApiErrorMessage } from "./api-client";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {
  nickname: string;
}

export function signup(body: SignupRequest) {
  return apiClient.post("members", { json: body })
    .json<ApiResponse<{ memberId: number; email: string; nickname: string }>>();
}

export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body })
    .json<ApiResponse<{ nickname: string; accessToken: string }>>();
}

export async function getMe(signal?: AbortSignal): Promise<MemberInfo> {
  const response = await authApi.get("members/me", { signal }).json<ApiResponse<MemberInfo>>();
  return response.result;
}

export function updateMe(body: { nickname: string }) {
  return authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>();
}

export function checkNickname(nickname: string): Promise<CheckResponse> {
  return apiClient.get(`members/nickname/${encodeURIComponent(nickname)}`).json();
}

export function checkEmail(email: string): Promise<CheckResponse> {
  return apiClient.get(`members/email/${encodeURIComponent(email)}`).json();
}

export function getMemberRatings(memberId: string, signal?: AbortSignal): Promise<RatingResponse[]> {
  return apiClient.get(`members/${encodeURIComponent(memberId)}/ratings`, { signal }).json();
}
